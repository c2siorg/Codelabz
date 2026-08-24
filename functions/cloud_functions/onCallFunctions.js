const { HttpsError } = require("firebase-functions/v2/https");
const { db, admin } = require("../auth");

exports.resendVerificationEmailHandler = async request => {
  try {
    const data = request.data;
    if (!data || !data.email) {
      console.log("Email is not defined");
      throw new HttpsError(
        "invalid-argument",
        "Email is required for the operation"
      );
    }
    const email = data.email;
    //get userRecord
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord) {
      console.log(`The given email: ${email} does not exist.`);
      throw new HttpsError("not-found", "The user does not exist.");
    }

    if (userRecord && userRecord.emailVerified === true) {
      console.log(`The given email: ${email} is already verified.`);
      throw new HttpsError(
        "aborted",
        "The given email is already verified."
      );
    }

    //send the verification email
    const link = await admin
      .auth()
      .generateEmailVerificationLink(userRecord.email);

    await db.collection("cl_mail").add({
      to: userRecord.email,
      template: {
        name: "verificationEmailTemplate",
        data: {
          verificationLink: link
        }
      }
    });

    return console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.log(error);
    throw new HttpsError("invalid-argument", error.message, error);
  }
};

exports.sendPasswordUpdateEmailHandler = async request => {
  try {
    const { email } = request.data;

    if (!request.auth) {
      console.log("The request must be authenticated.");
      throw new HttpsError(
        "unauthenticated",
        "The request does not have valid authentication credentials for the operation."
      );
    }
    if (!email) {
      console.log("Email is not provided");
      throw new HttpsError(
        "invalid-argument",
        "Email is required for this operation"
      );
    }

    const uid = request.auth.uid;
    const userRecord = await admin.auth().getUser(uid);
    const { email: userRecordEmail } = userRecord;

    if (email !== userRecordEmail) {
      console.log(
        `The given email: ${email} does not match with auth records: ${userRecordEmail}`
      );
      throw new HttpsError(
        "invalid-argument",
        "The provided email does not match with the authentication records."
      );
    }

    await db.collection("cl_mail").add({
      to: email,
      template: {
        name: "passwordUpdateEmailTemplate",
        data: {}
      }
    });

    return console.log("Password update email sent");
  } catch (error) {
    console.log(error.message);
    throw new HttpsError("aborted", error.message, error);
  }
};
