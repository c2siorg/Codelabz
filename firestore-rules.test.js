const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const fs = require("fs");

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "codelabz-rules-test",
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => await testEnv.cleanup());
afterEach(async () => await testEnv.clearFirestore());

async function seedOrgUser(uid, orgHandle, permission) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await ctx
      .firestore()
      .doc(`org_users/${orgHandle}_${uid}`)
      .set({ uid, org_handle: orgHandle, permissions: [permission] });
  });
}

/**
 * Cases where a failing rule hands someone power they should not have.
 */
describe("privilege escalation is blocked", () => {
  test("admin cannot create an owner", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.doc("org_users/org1_newUid").set({
        uid: "newUid",
        org_handle: "org1",
        permissions: [3],
        updated_by: "adminUid",
      })
    );
  });

  test("admin cannot demote an owner", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.doc("org_users/org1_ownerUid").update({
        permissions: [1],
        updated_by: "adminUid",
      })
    );
  });

  test("admin cannot delete an owner's membership", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(db.doc("org_users/org1_ownerUid").delete());
  });

  test("a member below admin cannot change anyone's role", async () => {
    await seedOrgUser("viewerUid", "org1", 0);
    await seedOrgUser("targetUid", "org1", 1);
    const db = testEnv.authenticatedContext("viewerUid").firestore();
    await assertFails(
      db.doc("org_users/org1_targetUid").update({
        permissions: [0],
        updated_by: "viewerUid",
      })
    );
  });

  test("owner cannot demote a fellow owner", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    await seedOrgUser("coOwnerUid", "org1", 3);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertFails(
      db.doc("org_users/org1_coOwnerUid").update({
        permissions: [1],
        updated_by: "ownerUid",
      })
    );
  });

  test("owner cannot remove a fellow owner", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    await seedOrgUser("coOwnerUid", "org1", 3);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertFails(db.doc("org_users/org1_coOwnerUid").delete());
  });

  test("a membership cannot be written under a mismatched document id", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertFails(
      db.doc("org_users/org1_wrongUid").set({
        uid: "newAdminUid",
        org_handle: "org1",
        permissions: [2],
        updated_by: "ownerUid",
      })
    );
  });

  test("a non-member cannot write themselves into an org", async () => {
    const db = testEnv.authenticatedContext("randomUid").firestore();
    await assertFails(
      db.doc("org_users/org1_randomUid").set({
        uid: "randomUid",
        org_handle: "org1",
        permissions: [3],
        updated_by: "randomUid",
      })
    );
  });

  test("a user cannot grant themselves platform admin at signup", async () => {
    const db = testEnv.authenticatedContext("sneakyUid").firestore();
    await assertFails(
      db.doc("cl_user/sneakyUid").set({
        uid: "sneakyUid",
        handle: "sneaky",
        is_platform_admin: true,
      })
    );
  });

  test("a user cannot grant themselves platform admin later", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_user/plainUid").set({ uid: "plainUid" });
    });
    const db = testEnv.authenticatedContext("plainUid").firestore();
    await assertFails(
      db.doc("cl_user/plainUid").update({ is_platform_admin: true })
    );
  });

  test("editor cannot change org settings", async () => {
    await seedOrgUser("editorUid", "org1", 1);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("editorUid").firestore();
    await assertFails(db.doc("cl_org_general/org1").update({ name: "Hacked" }));
  });

  test("admin cannot delete the org", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(db.doc("cl_org_general/org1").delete());
  });

  test("a non-platform-admin cannot force-unpublish an org", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await db.doc("cl_user/regularUid").set({ is_platform_admin: false });
      await db.doc("cl_org_general/org1").set({ org_published: true });
    });
    const db = testEnv.authenticatedContext("regularUid").firestore();
    await assertFails(
      db.doc("cl_org_general/org1").update({ org_published: false })
    );
  });

  test("nothing outside the declared collections is writable", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.doc("some_random_collection/doc1").set({ x: 1 }));
  });
});

/**
 * The audit trail is only worth having if it cannot be forged or erased.
 * Entries are written by the syncOrgUserWrite Cloud Function via the Admin SDK,
 * which reads the actor from updated_by -- context.auth is never populated on
 * Firestore triggers, so the field is the only trustworthy source, and only if
 * rules pin it to the caller.
 */
describe("the audit trail cannot be faked", () => {
  test("a client cannot write audit entries at all", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.collection("org_role_audit").add({
        actor_uid: "adminUid",
        target_uid: "victimUid",
        org_handle: "org1",
        old_permissions: [1],
        new_permissions: [3],
        timestamp: new Date(),
      })
    );
  });

  test("an admin cannot pin a role change on someone else", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await seedOrgUser("targetUid", "org1", 0);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.doc("org_users/org1_targetUid").update({
        permissions: [1],
        updated_by: "someoneElseUid",
      })
    );
  });
});

/**
 * Ownership has to be transferable, and an org must never be left with nobody
 * able to administer or delete it.
 */
describe("ownership stays intact", () => {
  test("owner CAN promote an admin to owner", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertSucceeds(
      db.doc("org_users/org1_adminUid").update({
        permissions: [3],
        updated_by: "ownerUid",
      })
    );
  });

  test("an owner cannot walk out and orphan the org", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertFails(db.doc("org_users/org1_ownerUid").delete());
  });
});

/**
 * Denial tests alone cannot tell you whether the product still works -- signup,
 * org creation and member removal were all completely blocked by these rules
 * while every negative test passed. These walk the flows a real user performs.
 */
describe("real users can still do their job", () => {
  test("a new user can create their own profile at signup", async () => {
    const db = testEnv.authenticatedContext("newUid").firestore();
    await assertSucceeds(
      db.doc("cl_user/newUid").set({
        uid: "newUid",
        handle: "newuser",
        displayName: "New User",
      })
    );
  });

  test("createOrganization's batch commits", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx
        .firestore()
        .doc("cl_user/founderUid")
        .set({ uid: "founderUid", organizations: [] });
    });
    const db = testEnv.authenticatedContext("founderUid").firestore();
    const batch = db.batch();
    batch.set(db.doc("cl_org_general/neworg"), {
      org_name: "New Org",
      org_handle: "neworg",
      org_email: "founder@example.com",
    });
    batch.update(db.doc("cl_user/founderUid"), { organizations: ["neworg"] });
    await assertSucceeds(batch.commit());
  });

  test("an admin can add a member", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertSucceeds(
      db.doc("org_users/org1_viewerUid").set({
        uid: "viewerUid",
        org_handle: "org1",
        permissions: [0],
        updated_by: "adminUid",
      })
    );
  });

  test("an admin can change org settings", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertSucceeds(
      db.doc("cl_org_general/org1").update({ name: "Updated" })
    );
  });

  test("an owner can delete the org", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertSucceeds(db.doc("cl_org_general/org1").delete());
  });

  test("a member can leave an org", async () => {
    await seedOrgUser("editorUid", "org1", 1);
    const db = testEnv.authenticatedContext("editorUid").firestore();
    await assertSucceeds(db.doc("org_users/org1_editorUid").delete());
  });

  test("a platform admin can force-unpublish an org", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await db.doc("cl_user/adminUid").set({ is_platform_admin: true });
      await db.doc("cl_org_general/org1").set({ org_published: true });
    });
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertSucceeds(
      db.doc("cl_org_general/org1").update({ org_published: false })
    );
  });
});
