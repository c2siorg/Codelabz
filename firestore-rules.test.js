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

describe("org_users RBAC", () => {
  test("viewer cannot update another user's role", async () => {
    await seedOrgUser("viewerUid", "org1", 0);
    await seedOrgUser("targetUid", "org1", 1);
    const db = testEnv.authenticatedContext("viewerUid").firestore();
    await assertFails(
      db.doc("org_users/org1_targetUid").update({ permissions: [0] })
    );
  });

  test("admin cannot create an owner (permission 3)", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.doc("org_users/org1_newUid").set({
        uid: "newUid",
        org_handle: "org1",
        permissions: [3],
      })
    );
  });

  test("admin cannot demote an owner", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.doc("org_users/org1_ownerUid").update({ permissions: [1] })
    );
  });

  test("admin cannot promote another member to owner", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await seedOrgUser("targetUid", "org1", 1);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.doc("org_users/org1_targetUid").update({ permissions: [3] })
    );
  });

  test("admin cannot delete an owner's membership", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(db.doc("org_users/org1_ownerUid").delete());
  });

  test("owner CAN demote an admin", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertSucceeds(
      db.doc("org_users/org1_adminUid").update({ permissions: [1] })
    );
  });

  test("owner CAN create an admin membership with matching document id", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertSucceeds(
      db.doc("org_users/org1_newAdminUid").set({
        uid: "newAdminUid",
        org_handle: "org1",
        permissions: [2],
      })
    );
  });

  test("owner cannot create membership with mismatched document id", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertFails(
      db.doc("org_users/org1_wrongUid").set({
        uid: "newAdminUid",
        org_handle: "org1",
        permissions: [2],
      })
    );
  });
});

describe("org_role_audit forgery protection", () => {
  test("client cannot write audit entries directly", async () => {
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

  test("cannot forge actor_uid as someone else", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(
      db.collection("org_role_audit").add({
        actor_uid: "someoneElseUid",
        target_uid: "victimUid",
        org_handle: "org1",
        old_permissions: [1],
        new_permissions: [0],
        timestamp: new Date(),
      })
    );
  });

  test("platform admin CAN read audit entries", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await db.doc("cl_user/platformUid").set({ is_platform_admin: true });
      await db.doc("org_role_audit/audit1").set({
        actor_uid: "ownerUid",
        target_uid: "adminUid",
        org_handle: "org1",
        old_permissions: [2],
        new_permissions: [1],
        timestamp: new Date(),
      });
    });
    const db = testEnv.authenticatedContext("platformUid").firestore();
    await assertSucceeds(db.doc("org_role_audit/audit1").get());
  });

  test("non-member cannot read audit entries", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("org_role_audit/audit1").set({
        actor_uid: "ownerUid",
        target_uid: "adminUid",
        org_handle: "org1",
        old_permissions: [2],
        new_permissions: [1],
        timestamp: new Date(),
      });
    });
    const db = testEnv.authenticatedContext("randomUid").firestore();
    await assertFails(db.doc("org_role_audit/audit1").get());
  });
});

/**
 * Denial tests alone cannot tell you whether the product still works, which is
 * how signup came to be locked out by its own rule. These walk the flows a real
 * user performs.
 */
describe("cl_user profile lifecycle", () => {
  test("a new user can create their own cl_user profile at signup", async () => {
    const db = testEnv.authenticatedContext("newUid").firestore();
    await assertSucceeds(
      db.doc("cl_user/newUid").set({
        uid: "newUid",
        handle: "newuser",
        displayName: "New User",
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

  test("a user cannot write someone else's profile", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_user/victimUid").set({ uid: "victimUid" });
    });
    const db = testEnv.authenticatedContext("attackerUid").firestore();
    await assertFails(
      db.doc("cl_user/victimUid").update({ displayName: "Hacked" })
    );
  });
});

describe("catch-all fallback removed", () => {
  test("unauthenticated user cannot read/write arbitrary collection", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.doc("some_random_collection/doc1").set({ x: 1 }));
  });

  test("authenticated non-member cannot write org_users directly", async () => {
    const db = testEnv.authenticatedContext("randomUid").firestore();
    await assertFails(
      db.doc("org_users/org1_randomUid").set({
        uid: "randomUid",
        org_handle: "org1",
        permissions: [3],
      })
    );
  });
});

describe("platform admin dashboard actions", () => {
  test("non-platform-admin cannot force-unpublish an org", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await db.doc("cl_user/regularUid").set({ is_platform_admin: false });
      await db.doc("cl_org_general/org1").set({ published: true });
    });
    const db = testEnv.authenticatedContext("regularUid").firestore();
    await assertFails(
      db.doc("cl_org_general/org1").update({ published: false })
    );
  });

  test("platform admin CAN force-unpublish an org", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await db.doc("cl_user/adminUid").set({ is_platform_admin: true });
      await db.doc("cl_org_general/org1").set({ published: true });
    });
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertSucceeds(
      db.doc("cl_org_general/org1").update({ published: false })
    );
  });
});
describe("cl_org_general permission matrix", () => {
  test("viewer cannot update org settings", async () => {
    await seedOrgUser("viewerUid", "org1", 0);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("viewerUid").firestore();
    await assertFails(db.doc("cl_org_general/org1").update({ name: "Hacked" }));
  });

  test("editor cannot update org settings", async () => {
    await seedOrgUser("editorUid", "org1", 1);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("editorUid").firestore();
    await assertFails(db.doc("cl_org_general/org1").update({ name: "Hacked" }));
  });

  test("admin CAN update org settings", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertSucceeds(db.doc("cl_org_general/org1").update({ name: "Updated" }));
  });

  test("admin cannot delete the org", async () => {
    await seedOrgUser("adminUid", "org1", 2);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("adminUid").firestore();
    await assertFails(db.doc("cl_org_general/org1").delete());
  });

  test("owner CAN delete the org", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc("cl_org_general/org1").set({ name: "Org One" });
    });
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertSucceeds(db.doc("cl_org_general/org1").delete());
  });
});

describe("org_users update/delete across all roles", () => {
  test("editor cannot update another user's role", async () => {
    await seedOrgUser("editorUid", "org1", 1);
    await seedOrgUser("targetUid", "org1", 0);
    const db = testEnv.authenticatedContext("editorUid").firestore();
    await assertFails(
      db.doc("org_users/org1_targetUid").update({ permissions: [1] })
    );
  });

  test("viewer cannot delete another user's membership", async () => {
    await seedOrgUser("viewerUid", "org1", 0);
    await seedOrgUser("targetUid", "org1", 0);
    const db = testEnv.authenticatedContext("viewerUid").firestore();
    await assertFails(db.doc("org_users/org1_targetUid").delete());
  });

  test("owner CAN delete an admin's membership", async () => {
    await seedOrgUser("ownerUid", "org1", 3);
    await seedOrgUser("adminUid", "org1", 2);
    const db = testEnv.authenticatedContext("ownerUid").firestore();
    await assertSucceeds(db.doc("org_users/org1_adminUid").delete());
  });

  test("any member can remove themselves (leave org)", async () => {
    await seedOrgUser("editorUid", "org1", 1);
    const db = testEnv.authenticatedContext("editorUid").firestore();
    await assertSucceeds(db.doc("org_users/org1_editorUid").delete());
  });
}); 
