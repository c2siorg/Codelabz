const { rtdb } = require("../auth");

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
