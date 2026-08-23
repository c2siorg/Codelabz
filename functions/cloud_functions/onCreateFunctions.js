const { db, rtdb, admin } = require("../auth");
const { FieldValue } = require("firebase-admin/firestore");

exports.sendVerificationEmailHandler = async event => {
  try {
    // Fires on cl_user/{uid} creation rather than the Auth event directly:
    // beforeUserCreated runs before the user record is committed, so
    // admin.auth().generateEmailVerificationLink() can't find it yet. By the
    // time the app writes the user's Firestore profile, the Auth user is
    // guaranteed to already exist.
    const { uid } = event.params;
    const { email, emailVerified } = await admin.auth().getUser(uid);

    if (!email) {
      return console.log(`Email is undefined for user: ${uid}`);
    }

    if (!emailVerified) {
      const verificationLink = await admin
        .auth()
        .generateEmailVerificationLink(email);
      await db.collection("cl_mail").add({
        to: email,
        template: {
          name: "verificationEmailTemplate",
          data: {
            verificationLink
          }
        }
      });
      return console.log(`Verification email sent to ${email}`);
    } else {
      return console.log(`${email} is already verified`);
    }
  } catch (e) {
    return console.log(e.message);
  }
};

exports.createOrganizationHandler = async event => {
  try {
    const { org_handle } = event.params;

    if (!event.data) {
      return console.log(
        `No snapshot associated with the create event for: ${org_handle}`
      );
    }

    const org_email = event.data.get("org_email");

    const querySnapshot = await db
      .collection("cl_user")
      .where("email", "==", org_email)
      .get();

    const user_uid =
      querySnapshot.docs.length > 0 ? querySnapshot.docs[0].id : null;

    if (!user_uid) {
      return console.log(
        `Error occurred. User with ${org_email} email not found.`
      );
    }

    /**
     * register org_handle in rtdb
     * @type {Promise<void>}
     */
    const registerOrgHandle = rtdb
      .ref(`cl_org_handle`)
      .update({ [org_handle]: true });

    /**
     * create org_metrics sub-collection
     * @type {Promise<FirebaseFirestore.WriteResult>}
     */
    const setOrgMetrics = db
      .collection("cl_org_general")
      .doc(org_handle)
      .collection("cl_org_metrics")
      .doc("metrics")
      .set({
        launch: "",
        launched: false,
        tutorials: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });

    /**
     * create org_users collection => set user uid and respective permissions
     * @type {Promise<FirebaseFirestore.WriteResult>}
     */
    const setOrgUsers = db
      .collection("org_users")
      .doc(`${org_handle}_${user_uid}`)
      .set({
        uid: user_uid,
        org_handle,
        permissions: [3],
        // stamped so the audit trail attributes the founding owner record to
        // the founder rather than to the system
        updated_by: user_uid
      });

    await Promise.all([registerOrgHandle, setOrgMetrics, setOrgUsers]);
    return console.log(
      `The data of organization: ${org_handle} of user: ${user_uid} is successfully added.`
    );
  } catch (e) {
    return console.log(e);
  }
};
