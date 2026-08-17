const { onCall } = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
  onDocumentWritten,
  onDocumentUpdated
} = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const dotenv = require("dotenv");
dotenv.config({
  path: "../.env"
});

/**
 * +++++++++++++++++++CLOUD FUNCTIONS+++++++++++++++++++++++++++++
 */

/**Import functions
 */
const onCallFunctions = require("./cloud_functions/onCallFunctions");
const onCreateFunctions = require("./cloud_functions/onCreateFunctions");
const onWriteFunctions = require("./cloud_functions/onWriteFunctions");
const onUpdateFunctions = require("./cloud_functions/onUpdateFunctions");
const pubSubFunctions = require("./cloud_functions/pubSubFunctions");

//+++++++++++++++++++++onCall Functions+++++++++++++++++++++++++++++++++
exports.resendVerificationEmail = onCall(
  onCallFunctions.resendVerificationEmailHandler
);

exports.sendPasswordUpdateEmail = onCall(
  onCallFunctions.sendPasswordUpdateEmailHandler
);

//+++++++++++++++++++++Firestore triggers+++++++++++++++++++++++++++++++
exports.createOrganization = onDocumentCreated(
  "cl_org_general/{org_handle}",
  onCreateFunctions.createOrganizationHandler
);

// Fires once the app writes the user's cl_user profile doc on signup — by
// then the Auth user record is guaranteed to exist (see comment in the
// handler for why this isn't wired to the Auth event directly).
exports.sendVerificationEmail = onDocumentCreated(
  "cl_user/{uid}",
  onCreateFunctions.sendVerificationEmailHandler
);

exports.registerUserHandle = onDocumentWritten(
  "cl_user/{uid}",
  onWriteFunctions.registerUserHandleHandler
);

exports.updateOrgUser = onDocumentUpdated(
  "cl_org_general/{org_handle}/cl_org_users/users",
  onUpdateFunctions.addOrgUserHandler
);

//++++++++++++++++++++Pub/Sub Functions++++++++++++++++++++++++++++++
exports.deleteTutorialSteps = onSchedule(
  "every 7 days",
  pubSubFunctions.deleteTutorialStepsHandler
);
