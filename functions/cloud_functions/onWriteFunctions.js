const { db, rtdb, admin } = require("../auth");

exports.registerUserHandleHandler = async event => {
  try {
    if (!event.data) {
      return console.log("No change associated with the write event");
    }

    const newValue = event.data.after.get("handle");
    const previousValue = event.data.before.get("handle");

    if (
      previousValue === undefined &&
      newValue !== undefined &&
      newValue !== previousValue
    ) {
      await rtdb.ref(`cl_user_handle`).update({ [newValue]: true });
    }

    return console.log("Function executed");
  } catch (e) {
    return console.log(e);
  }
};

/**
 * reads the single permission level out of an org_users document
 * @param data {Object|null} the document data, or null if it does not exist
 * @return {number|null}
 */
const permissionLevelOf = data =>
  data && Array.isArray(data.permissions) ? data.permissions[0] : null;

/**
 * describes the membership change in a single word, for the audit trail
 * @param before {Object|null}
 * @param after {Object|null}
 * @return {string}
 */
const describeChange = (before, after) => {
  if (!before) return "member_added";
  if (!after) return "member_removed";
  return "role_changed";
};

/**
 * works out who performed the change
 *
 * The actor is read from the document's own updated_by field, which security
 * rules force to equal the caller's uid, so it cannot be forged. context.auth
 * is deliberately not used: Firestore triggers never populate it, only
 * Realtime Database triggers and callable functions do.
 *
 * A delete leaves no document to read, so removals cannot be attributed this
 * way and are recorded as unknown. Attributing those too would mean routing
 * removals through a callable function.
 *
 * @param after {Object|null} the document after the write, null on delete
 * @return {string}
 */
const actorOf = after => {
  if (!after) return "unknown";
  return after.updated_by || "system";
};

/**
 * Runs on every org_users write and owns the two things a client is not
 * allowed to do for itself:
 *
 *  1. keeping cl_user.organizations in step with the membership record, since
 *     rules only let a client write its own cl_user document; and
 *  2. appending to org_role_audit, which denies all client writes so that the
 *     trail cannot be forged or erased.
 *
 * Role-neutral edits are ignored so the trail stays readable.
 *
 * @type {Promise<void>}
 */
exports.syncOrgUserWriteHandler = async event => {
  try {
    if (!event.data) {
      return console.log("No change associated with the write event");
    }

    const before = event.data.before.exists ? event.data.before.data() : null;
    const after = event.data.after.exists ? event.data.after.data() : null;

    const record = after || before;
    if (!record || !record.uid || !record.org_handle) {
      return console.log("org_users write ignored: incomplete document");
    }

    const { uid, org_handle } = record;
    if (permissionLevelOf(before) === permissionLevelOf(after)) {
      return console.log(
        `org_users/${org_handle}_${uid} changed without affecting its role, skipping`
      );
    }

    /**
     * add or remove the handle on the member's profile
     * merge is used because the profile may not exist yet at signup time
     * @type {Promise<FirebaseFirestore.WriteResult>}
     */
    const syncUserOrganizations = db
      .collection("cl_user")
      .doc(uid)
      .set(
        {
          organizations: after
            ? admin.firestore.FieldValue.arrayUnion(org_handle)
            : admin.firestore.FieldValue.arrayRemove(org_handle)
        },
        { merge: true }
      );

    /**
     * append the immutable audit entry
     * @type {Promise<FirebaseFirestore.DocumentReference>}
     */
    const recordAuditEntry = db.collection("org_role_audit").add({
      org_handle,
      actor_uid: actorOf(after),
      target_uid: uid,
      action: describeChange(before, after),
      old_permissions: before ? before.permissions : null,
      new_permissions: after ? after.permissions : null,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    await Promise.all([syncUserOrganizations, recordAuditEntry]);
    return console.log(
      `Recorded ${describeChange(before, after)} for ${uid} in ${org_handle}.`
    );
  } catch (e) {
    return console.log(e);
  }
};
