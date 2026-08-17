const { db } = require("../auth");
const { FieldValue } = require("firebase-admin/firestore");
const _ = require("lodash");

exports.addOrgUserHandler = async event => {
  try {
    const newValue = _.omit(event.data.after.data(), [
      "createdAt",
      "updatedAt"
    ]);
    const previousValue = _.omit(event.data.before.data(), [
      "createdAt",
      "updatedAt"
    ]);
    const newUsersList = Object.keys(newValue);
    const previousUsersList = Object.keys(previousValue);

    //check if the new array has a new user
    /**example
     * newUsersList = [1,2,3]
     * previousUsersList = [1,2]
     * addedUser = [3]
     * @type {array<string>}
     */
    const addedUser = _.difference(newUsersList, previousUsersList);

    //check if the new array has removed user
    /**example
     * newUsersList = [1,2]
     * previousUsersList = [1,2,3]
     * removedUser = [3]
     * @type {array<string>}
     */
    const removedUser = _.difference(previousUsersList, newUsersList);

    if (addedUser.length > 0) {
      await db
        .collection("cl_user")
        .doc(addedUser[0])
        .update({
          organizations: FieldValue.arrayUnion(event.params.org_handle)
        });
      return console.log(
        `user [${addedUser[0]}] successfully updated. Added [${event.params.org_handle}] to organizations.`
      );
    } else if (removedUser.length > 0) {
      await db
        .collection("cl_user")
        .doc(removedUser[0])
        .update({
          organizations: FieldValue.arrayRemove(event.params.org_handle)
        });
      return console.log(
        `user [${removedUser[0]}] successfully updated. Removed [${event.params.org_handle}] from organizations.`
      );
    } else {
      return console.log(`No new added users or removed users`);
    }
  } catch (e) {
    return console.log(e);
  }
};
