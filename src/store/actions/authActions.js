import * as actions from "./actionTypes";
import _ from "lodash";
import { functions } from "../../config";

/**
 * Helper to extract error message from error object
 * @param {Error|Object|string} e
 * @returns {string}
 */
const getErrorMessage = e => {
  if (typeof e === "string") return e;
  return _.get(e, "message", "An unexpected error occurred");
};

export const signIn = credentials => async (firebase, dispatch) => {
  try {
    dispatch({ type: actions.SIGN_IN_START });
    dispatch({ type: actions.CLEAR_AUTH_VERIFY_EMAIL_STATE });
    const userData = await firebase.login(credentials);
    if (_.get(userData, "user.emailVerified", false)) {
      dispatch({ type: actions.SIGN_IN_SUCCESS });
    } else {
      await firebase.logout();
      dispatch({
        type: actions.SET_VERIFY_EMAIL_FAIL,
        payload: credentials.email
      });
      dispatch({
        type: actions.SIGN_IN_FAIL,
        payload: "email-unverified"
      });
    }
  } catch (e) {
    dispatch({ type: actions.SIGN_IN_FAIL, payload: getErrorMessage(e) });
  }
};

export const signInWithGoogle = () => async (firebase, dispatch) => {
  try {
    dispatch({ type: actions.SIGN_IN_START });
    await firebase.login({
      provider: "google",
      type: "popup"
    });
    dispatch({ type: actions.SIGN_IN_SUCCESS });
  } catch (e) {
    dispatch({ type: actions.SIGN_IN_FAIL, payload: getErrorMessage(e) });
  }
};

export const signInWithProviderID =
  providerID => async (firebase, dispatch) => {
    try {
      if (!["github", "twitter", "facebook"].includes(providerID)) {
        dispatch({
          type: actions.SIGN_IN_FAIL,
          payload: "Invalid provider selected"
        });
        return;
      }
      dispatch({ type: actions.SIGN_IN_START });
      await firebase.login({
        provider: providerID,
        type: "popup"
      });
      dispatch({ type: actions.SIGN_IN_SUCCESS });
    } catch (e) {
      if (e.code === "auth/account-exists-with-different-credential") {
        const methods = await firebase
          .auth()
          .fetchSignInMethodsForEmail(e.email);
        dispatch({
          type: actions.SIGN_IN_FAIL,
          payload: `You already have an account created using ${methods.join(
            ", "
          )}. Log in with ${methods.join(", ")} to continue.`
        });
      } else {
        dispatch({ type: actions.SIGN_IN_FAIL, payload: getErrorMessage(e) });
      }
    }
  };

export const signOut = () => async (firebase, dispatch) => {
  try {
    dispatch({ type: actions.CLEAR_AUTH_PROFILE_STATE });
    dispatch({ type: actions.CLEAR_AUTH_VERIFY_EMAIL_STATE });
    dispatch({ type: actions.CLEAR_AUTH_RECOVER_PASSWORD_STATE });
    dispatch({ type: actions.CLEAR_PROFILE_EDIT_STATE });
    dispatch({ type: actions.CLEAR_PROFILE_DATA_STATE });
    dispatch({ type: actions.CLEAR_ORG_GENERAL_STATE });
    dispatch({ type: actions.CLEAR_ORG_USER_STATE });
    await firebase.logout();
  } catch (e) {
    console.error("Sign out error:", e.message);
  }
};

export const signUp = userData => async (firebase, dispatch) => {
  try {
    dispatch({ type: actions.SIGN_UP_START });
    const { email, password } = userData;

    // createUser automatically handles document creation in cl_user 
    // due to userProfile: "cl_user" and profileFactory in rrfConfig
    const newUser = await firebase.createUser({ email, password }, { email });
    const currentUser = newUser.user || firebase.auth().currentUser;
    
    if (!currentUser) {
      throw new Error("User not found after signup");
    }

    try {
      await currentUser.sendEmailVerification();
    } catch (verificationError) {
      console.error("Error sending email verification:", verificationError);
      // We don't throw here to allow the signup to be considered successful,
      // but we notify the user through state if necessary.
    }

    await firebase.logout();
    dispatch({ type: actions.SIGN_UP_SUCCESS });
  } catch (e) {
    dispatch({ type: actions.SIGN_UP_FAIL, payload: getErrorMessage(e) });
  }
};

export const clearAuthError = () => async dispatch => {
  dispatch({ type: actions.CLEAR_AUTH_PROFILE_STATE });
  dispatch({ type: actions.CLEAR_AUTH_VERIFY_EMAIL_STATE });
};

export const clearRecoverPasswordError = () => async dispatch => {
  dispatch({ type: actions.CLEAR_AUTH_RECOVER_PASSWORD_STATE });
};

export const sendPasswordResetEmail = email => async (firebase, dispatch) => {
  try {
    dispatch({ type: actions.SEND_RESET_EMAIL_START });
    await firebase.resetPassword(email);
    dispatch({ type: actions.SEND_RESET_EMAIL_SUCCESS });
  } catch (e) {
    dispatch({ type: actions.SEND_RESET_EMAIL_FAIL, payload: getErrorMessage(e) });
  }
};

export const verifyPasswordResetCode =
  actionCode => async (firebase, dispatch) => {
    try {
      dispatch({ type: actions.VERIFY_RESET_CODE_START });
      const email = await firebase.verifyPasswordResetCode(actionCode);
      dispatch({ type: actions.VERIFY_RESET_CODE_SUCCESS, payload: email });
    } catch (e) {
      dispatch({ type: actions.VERIFY_RESET_CODE_FAIL, payload: getErrorMessage(e) });
    }
  };

export const confirmPasswordReset =
  ({ actionCode, password }) =>
    async (firebase, dispatch) => {
      try {
        dispatch({ type: actions.PASSWORD_RECOVERY_START });
        await firebase.confirmPasswordReset(actionCode, password);
        dispatch({ type: actions.PASSWORD_RECOVERY_SUCCESS });
      } catch (e) {
        dispatch({ type: actions.PASSWORD_RECOVERY_FAIL, payload: getErrorMessage(e) });
      }
    };

export const verifyEmail = actionCode => async (firebase, dispatch) => {
  try {
    dispatch({ type: actions.EMAIL_VERIFY_START });
    await firebase.auth().applyActionCode(actionCode);
    dispatch({ type: actions.EMAIL_VERIFY_SUCCESS });
  } catch (e) {
    dispatch({ type: actions.EMAIL_VERIFY_FAIL, payload: getErrorMessage(e) });
  }
};

export const resendVerifyEmail = email => async dispatch => {
  try {
    dispatch({ type: actions.RESEND_VERIFY_EMAIL_START });
    dispatch({ type: actions.CLEAR_AUTH_PROFILE_STATE });
    const resendVerificationEmail = functions.httpsCallable(
      "resendVerificationEmail"
    );
    await resendVerificationEmail({ email });
    dispatch({ type: actions.RESEND_VERIFY_EMAIL_SUCCESS });
  } catch (e) {
    dispatch({ type: actions.RESEND_VERIFY_EMAIL_FAIL, payload: getErrorMessage(e) });
  }
};

export const checkUserHandleExists = userHandle => async firebase => {
  try {
    const handle = await firebase
      .database()
      .ref(`/cl_user_handle/${userHandle}`)
      .once("value");
    return handle.exists();
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
};

export const checkOrgHandleExists = orgHandle => async firestore => {
  try {
    const organizationHandle = await firestore
      .collection("cl_org_general")
      .doc(orgHandle)
      .get();
    return organizationHandle.exists;
  } catch (e) {
    throw new Error(getErrorMessage(e));
  }
};

export const setUpInitialData =
  data => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.INITIAL_SETUP_START });
      const userData = firebase.auth().currentUser;
      if (!userData) {
        throw new Error("No authenticated user found");
      }

      const {
        orgData,
        name: displayName,
        handle,
        country,
        org_handle,
        org_name,
        org_website,
        org_country
      } = data;

      const isUserHandleExists = await checkUserHandleExists(handle)(firebase);
      if (isUserHandleExists) {
        dispatch({
          type: actions.INITIAL_SETUP_FAIL,
          payload: { message: `Handle [${handle}] is already taken` }
        });
        return;
      }

      const serverTimestamp = firestore.FieldValue.serverTimestamp();

      if (orgData) {
        const isOrgHandleExists = await checkOrgHandleExists(org_handle)(firestore);
        if (isOrgHandleExists) {
          dispatch({
            type: actions.INITIAL_SETUP_FAIL,
            payload: { message: `Handle [${org_handle}] is already taken` }
          });
          return;
        }

        // Create Organization
        await firestore.set(
          { collection: "cl_org_general", doc: org_handle },
          {
            org_name,
            org_handle,
            org_website,
            org_country,
            org_email: userData.email,
            org_created_date: serverTimestamp,
            createdAt: serverTimestamp,
            updatedAt: serverTimestamp
          }
        );

        // Add user as admin (permissions [3])
        await firestore.set(
          { collection: "org_users", doc: `${org_handle}_${userData.uid}` },
          {
            uid: userData.uid,
            org_handle: org_handle,
            permissions: [3]
          }
        );

        // Update User Profile 
        // Note: updateProfile automatically syncs with cl_user collection
        await firebase.updateProfile(
          {
            displayName,
            handle,
            country,
            organizations: [org_handle],
            updatedAt: serverTimestamp
          },
          { useSet: false, merge: true }
        );
      } else {
        // Update User Profile without organization
        await firebase.updateProfile(
          {
            displayName,
            handle,
            country,
            organizations: [],
            updatedAt: serverTimestamp
          },
          { useSet: false, merge: true }
        );
      }
      
      dispatch({ type: actions.INITIAL_SETUP_SUCCESS });
    } catch (e) {
      console.error("Setup initial data error:", e);
      dispatch({ type: actions.INITIAL_SETUP_FAIL, payload: getErrorMessage(e) });
    }
  };
