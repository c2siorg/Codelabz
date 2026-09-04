import _ from "lodash";
import Elasticlunr from "../../helpers/elasticlunr";
import * as actions from "./actionTypes";
import { checkOrgHandleExists } from "./authActions";
import { createNotification } from "./notificationActions";
import { hasPermission, getPermissionLevel, PERMISSION_LEVELS } from "../../helpers/rbac";

const elasticlunr = new Elasticlunr("handle", "handle", "name");

const PERMISSION_LABELS = {
  0: "Reviewer",
  1: "Editor",
  2: "Admin",
  3: "Owner"
};

export const searchFromIndex = query => {
  return elasticlunr.searchFromIndex(query);
};

export const getOrgUserData = org_handle => async (firestore, dispatch) => {
  try {
    dispatch({ type: actions.GET_ORG_USER_DATA_START });
    const orgUsersSnap = await firestore
      .collection("org_users")
      .where("org_handle", "==", org_handle)
      .get();

    const orgUsersDocs = orgUsersSnap.docs.map(doc => doc.data());

    const orgPromises = orgUsersDocs.map(async user => {
      let userDoc = await firestore.collection("cl_user").doc(user.uid).get();
      return {
        name: userDoc.get("displayName"),
        handle: userDoc.get("handle"),
        image: userDoc.get("photoURL"),
        permission_level: user.permissions
      };
    });
    const orgUserData = await Promise.all(orgPromises);

    dispatch({
      type: actions.GET_ORG_USER_DATA_SUCCESS,
      payload: _.orderBy(orgUserData, ["permission_level"], ["desc"])
    });
    orgUserData.forEach(doc => {
      elasticlunr.addDocToIndex(doc);
    });
  } catch (e) {
    dispatch({ type: actions.GET_ORG_USER_DATA_FAIL, payload: e.message });
  }
};

// adds a user to organization's users list with a set of permissions
export const addOrgUser =
  ({ org_handle, handle, permissions, actor_uid }) =>
  async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.ADD_ORG_USER_START });
      const userDoc = await firestore
        .collection("cl_user")
        .where("handle", "==", handle)
        .get();
      if (userDoc.docs.length === 1) {
        const uid = userDoc.docs[0].get("uid");
        const newMemberName = userDoc.docs[0].get("displayName") || handle;

        const existingMemberDoc = await firestore
          .collection("org_users")
          .doc(`${org_handle}_${uid}`)
          .get();
        const isNewMember = !existingMemberDoc.exists;

        await firestore
          .collection("org_users")
          .doc(`${org_handle}_${uid}`)
          .set({
            uid: uid,
            org_handle: org_handle,
            permissions: permissions,
            // rules reject any value but the caller's own uid, which is what
            // makes this trustworthy as the audit trail's actor
            updated_by: actor_uid
          });

        if (isNewMember) {
          const isNewMemberOwner =
            Array.isArray(permissions) && permissions.includes(3);
          if (!isNewMemberOwner) {
            const ownersSnap = await firestore
              .collection("org_users")
              .where("org_handle", "==", org_handle)
              .where("permissions", "array-contains", 3)
              .get();

            await Promise.all(
              ownersSnap.docs
                .filter(ownerDoc => ownerDoc.get("uid") !== uid)
                .map(ownerDoc =>
                  createNotification(firestore, {
                    recipient_uid: ownerDoc.get("uid"),
                    sender_uid: uid,
                    type: "org_join",
                    content: `${newMemberName} joined your organization ${org_handle}`,
                    username: newMemberName,
                    org: org_handle
                  })
                )
            );
          }
        } else {
          const permissionLevel = Array.isArray(permissions)
            ? permissions[0]
            : permissions;
          const permissionLabel =
            PERMISSION_LABELS[permissionLevel] || "a new role";
          await createNotification(firestore, {
            recipient_uid: uid,
            type: "permission_change",
            content: `Your role in ${org_handle} was changed to ${permissionLabel}`,
            username: "",
            org: org_handle
          });
        }

        await getOrgUserData(org_handle)(firestore, dispatch);
        dispatch({ type: actions.ADD_ORG_USER_SUCCESS });
      } else {
        dispatch({
          type: actions.ADD_ORG_USER_FAIL,
          payload: `User [${handle}] is not registered with CodeLabz`
        });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: actions.ADD_ORG_USER_FAIL, payload: e.message });
    }
  };

// removes all permissions of a user from an organization
export const removeOrgUser =
  ({ org_handle, handle }) =>
  async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.REMOVE_ORG_USER_START });
      const userDoc = await firestore
        .collection("cl_user")
        .where("handle", "==", handle)
        .get();
      if (userDoc.docs.length === 1) {
        const uid = userDoc.docs[0].get("uid");
        const docRef = firestore.collection("org_users").doc(`${org_handle}_${uid}`);

        // Only the membership record is removed here. Stripping the handle from
        // the removed user's cl_user.organizations is done by the
        // syncOrgUserWrite Cloud Function -- a client may only write its own
        // cl_user document, so doing it here would be denied and leave a
        // dangling org handle on the removed member.
        await docRef.delete();

        await createNotification(firestore, {
          recipient_uid: uid,
          type: "org_removed",
          content: `You were removed from ${org_handle}`,
          username: "",
          org: org_handle
        });

        await getOrgUserData(org_handle)(firestore, dispatch);
        dispatch({ type: actions.REMOVE_ORG_USER_SUCCESS });
      } else {
        dispatch({
          type: actions.REMOVE_ORG_USER_FAIL,
          payload: `User [${handle}] is not registered with CodeLabz`
        });
      }
    } catch (e) {
      dispatch({ type: actions.REMOVE_ORG_USER_FAIL, payload: e.message });
    }
  };

export const getOrgBasicData = org_handle => async firebase => {
  try {
    const firestore = firebase.firestore();
    const {
      currentUser: { uid }
    } = firebase.auth();
    const orgDoc = await firestore
      .collection("cl_org_general")
      .doc(org_handle)
      .get();

    if (!orgDoc.exists) return null;

    const orgPermissionDoc = await firestore
      .collection("org_users")
      .doc(`${org_handle}_${uid}`)
      .get();

    if (!orgPermissionDoc.exists) return null;

    const user_permissions = orgPermissionDoc.get("permissions");

    if (!user_permissions) return null;

    const orgData = orgDoc.data();
    return {
      ...orgData,
      org_image: orgData.org_image ? orgData.org_image : "",
      permissions: user_permissions
    };
  } catch (e) {
    console.error(`[getOrgBasicData] error for ${org_handle}:`, e.message);
    return null;
  }
};

export const editGeneralData =
  (orgData, currentOrgData) => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.EDIT_ORG_GENERAL_START });
      const { org_handle } = orgData;
      const org_Data = _.pickBy(orgData, _.identity);
      await firestore
        .collection("cl_org_general")
        .doc(org_handle)
        .update({
          ...org_Data,
          updatedAt: firestore.FieldValue.serverTimestamp()
        });

      const newData = await getOrgBasicData(org_handle)(firebase);
      const update = _.unionBy([newData], currentOrgData, "org_handle");
      dispatch({
        type: actions.GET_PROFILE_DATA_SUCCESS,
        payload: { organizations: _.orderBy(update, ["org_handle"], ["asc"]) }
      });

      dispatch({ type: actions.EDIT_ORG_GENERAL_SUCCESS });
    } catch (e) {
      dispatch({ type: actions.EDIT_ORG_GENERAL_FAIL, payload: e.message });
    }
  };

export const clearEditGeneral = () => dispatch => {
  dispatch({ type: actions.CLEAR_EDIT_ORG_GENERAL });
};

export const unPublishOrganization =
  (org_handle, published, currentOrgData) =>
  async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.EDIT_ORG_GENERAL_START });
      await firestore.collection("cl_org_general").doc(org_handle).update({
        org_published: !published,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });

      const newData = await getOrgBasicData(org_handle)(firebase);
      const update = _.unionBy([newData], currentOrgData, "org_handle");
      dispatch({
        type: actions.GET_PROFILE_DATA_SUCCESS,
        payload: { organizations: _.orderBy(update, ["org_handle"], ["asc"]) }
      });

      dispatch({ type: actions.EDIT_ORG_GENERAL_SUCCESS });
    } catch (e) {
      dispatch({ type: actions.EDIT_ORG_GENERAL_FAIL, payload: e.message });
    }
  };

export const uploadOrgProfileImage =
  (file, org_handle, currentOrgData) => async (firebase, dispatch) => {
    try {
      const storagePath = `organizations/${org_handle}/images`;
      const dbPath = "cl_org_general";
      await firebase.uploadFile(storagePath, file, dbPath, {
        metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
          return { org_image: downloadURL };
        },
        documentId: org_handle
      });

      const newData = await getOrgBasicData(org_handle)(firebase);
      const update = _.unionBy([newData], currentOrgData, "org_handle");
      dispatch({
        type: actions.GET_PROFILE_DATA_SUCCESS,
        payload: { organizations: _.orderBy(update, ["org_handle"], ["asc"]) }
      });

      dispatch({ type: actions.EDIT_ORG_GENERAL_SUCCESS });
    } catch (e) {
      dispatch({ type: actions.EDIT_ORG_GENERAL_FAIL, payload: e.message });
    }
  };

export const getOrgData =
  (org_handle, organizations) => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_ORG_DATA_START });

      const isOrgExists = await checkOrgHandleExists(org_handle)(firestore);

      if (isOrgExists) {
        const doc = await firestore
          .collection("cl_org_general")
          .doc(org_handle)
          .get();

        const userOrgs = Array.isArray(organizations) ? organizations : [];
        const isOrgPublished = doc.get("org_published");

        let isMember = userOrgs.includes(org_handle);

        if (!isMember && !isOrgPublished) {
          const auth = firebase.auth().currentUser;
          if (auth) {
            const memberDoc = await firestore
              .collection("org_users")
              .doc(`${org_handle}_${auth.uid}`)
              .get();
            isMember = memberDoc.exists;
          }
        }

        const isPublished = isOrgPublished || isMember;

        if (isPublished) {
          dispatch({
            type: actions.GET_ORG_DATA_SUCCESS,
            payload: {
              ...doc.data(),
              userSubscription: await isUserSubscribed(
                org_handle,
                firebase,
                firestore
              )
            }
          });
        } else {
          dispatch({ type: actions.GET_ORG_DATA_SUCCESS, payload: false });
        }
      } else {
        dispatch({ type: actions.GET_ORG_DATA_SUCCESS, payload: false });
      }
    } catch (e) {
      console.error("getOrgData error:", e.message);
      dispatch({ type: actions.GET_ORG_DATA_FAIL, payload: e.message });
    }
  };

export const clearOrgData = () => dispatch => {
  dispatch({ type: actions.CLEAR_ORG_DATA_STATE });
};

export const getLaunchedOrgsData = () => async (firestore, dispatch) => {
  try {
    dispatch({ type: actions.GET_LAUNCHED_ORGS_START });
    const lauchedOrgs = (
      await firestore
        .collection("cl_org_general")
        .where("org_published", "==", true)
        .get()
    ).docs.map(doc => doc.data());

    dispatch({ type: actions.GET_LAUNCHED_ORGS_SUCCESS, payload: lauchedOrgs });
  } catch (e) {
    dispatch({ type: actions.GET_LAUNCHED_ORGS_FAIL, payload: e.message });
  }
};

export const isUserSubscribed = async (org_handle, firebase, firestore) => {
  const auth = firebase.auth().currentUser;

  const subscription = await firestore
    .collection("org_subscribers")
    .doc(`${org_handle}_${auth.uid}`)
    .get();

  return subscription.exists;
};

export const subscribeOrg =
  org_handle => async (firebase, firestore, dispatch) => {
    try {
      const auth = firebase.auth().currentUser;

      await firestore
        .collection("org_subscribers")
        .doc(`${org_handle}_${auth.uid}`)
        .set({
          uid: auth.uid,
          org_handle
        });

      await firestore
        .collection("cl_org_general")
        .doc(org_handle)
        .update({
          followerCount: firebase.firestore.FieldValue.increment(1)
        });

      getOrgData(org_handle, [org_handle])(firebase, firestore, dispatch);
    } catch (e) {
      console.log(e);
    }
  };

export const unSubscribeOrg =
  org_handle => async (firebase, firestore, dispatch) => {
    try {
      const auth = firebase.auth().currentUser;
      await firestore
        .collection("org_subscribers")
        .doc(`${org_handle}_${auth.uid}`)
        .delete();

      await firestore
        .collection("cl_org_general")
        .doc(org_handle)
        .update({
          followerCount: firebase.firestore.FieldValue.increment(-1)
        });

      getOrgData(org_handle, [org_handle])(firebase, firestore, dispatch);
    } catch (e) {
      console.log(e);
    }
  };
export const removeFollower =
  (val, people, handle, orgFollowed, profileId) => firestore => {
    try {
      var filteredFollowers = people.filter(function (value) {
        return value !== val;
      });
      firestore.collection("cl_org_general").doc(handle).update({
        followers: filteredFollowers
      });
      var Orgfiltered = orgFollowed.filter(function (value) {
        return handle !== value;
      });
      firestore.collection("cl_user").doc(profileId).update({
        orgFollowed: Orgfiltered
      });
    } catch (e) {
      console.log(e);
    }
  };

export const addFollower =
  (value, people, handle, orgFollowed, profileId) => firestore => {
    try {
      // already a follower, nothing to do
      if (people && people.includes(value)) {
        return;
      }
      if (people) {
        const arr = [...people];
        arr.push(value);
        firestore.collection("cl_org_general").doc(handle).update({
          followers: arr
        });
        var arr2 = [];
        if (orgFollowed) arr2 = [...orgFollowed];

        arr2.push(handle);
        firestore.collection("cl_user").doc(profileId).update({
          orgFollowed: arr2
        });
      } else {
        firestore
          .collection("cl_user")
          .doc(profileId)
          .update({
            orgFollowed: [handle]
          });
        firestore
          .collection("cl_org_general")
          .doc(handle)
          .update({
            followers: [value]
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

export const deleteOrganization =
  org_handle =>
  async (firebase, dispatch) => {
    try {
      dispatch({ type: actions.DELETE_ORG_START });

      const db = firebase.firestore();
      const batch = db.batch();

      // every membership row belonging to this org
      const orgUsersSnap = await db
        .collection("org_users")
        .where("org_handle", "==", org_handle)
        .get();

      // remove org from each member's orgs, not just the owner's
      const memberUpdates = orgUsersSnap.docs.map(async memberDoc => {
        batch.delete(memberDoc.ref);
        const memberUid = memberDoc.data().uid;
        await db
          .collection("cl_user")
          .doc(memberUid)
          .update({
            organizations: firebase.firestore.FieldValue.arrayRemove(org_handle)
          });
      });
      await Promise.all(memberUpdates);

      // remove org from the organization collection last, so a partial
      // failure above does not leave the memberships orphaned
      const orgRef = db.collection("cl_org_general").doc(org_handle);
      batch.delete(orgRef);

      await batch.commit();

      dispatch({ type: actions.DELETE_ORG_SUCCESS });
      dispatch({ type: actions.CLEAR_ORG_GENERAL_STATE });
      dispatch({ type: actions.CLEAR_ORG_USER_STATE });
      return true;
    } catch (e) {
      dispatch({ type: actions.DELETE_ORG_FAIL, payload: e.message });
      throw e;
    }
  };

export const updateOrgUserPermissions =
  ({ org_handle, handle, newPermissions, actorPermissions, actor_uid }) =>
  async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.UPDATE_ORG_USER_PERMISSIONS_START });

      if (!hasPermission(actorPermissions, PERMISSION_LEVELS.ADMIN)) {
        dispatch({
          type: actions.UPDATE_ORG_USER_PERMISSIONS_FAIL,
          payload: "Insufficient permissions to change roles"
        });
        return;
      }
      // Mirrors canAssignRole() in firestore.rules: an admin may only hand out
      // roles below their own, while an owner may also grant ownership so that
      // an org can transfer or share it. The rules remain the real enforcement;
      // this only keeps the UI from firing a write that would be rejected.
      const actorLevel = getPermissionLevel(actorPermissions);
      const canGrant =
        newPermissions[0] < actorLevel || actorLevel === PERMISSION_LEVELS.OWNER;
      if (!canGrant) {
        dispatch({
          type: actions.UPDATE_ORG_USER_PERMISSIONS_FAIL,
          payload: "Cannot assign a role equal to or higher than your own"
        });
        return;
      }

      const userDoc = await firestore
        .collection("cl_user")
        .where("handle", "==", handle)
        .get();
      if (userDoc.docs.length !== 1) {
        dispatch({
          type: actions.UPDATE_ORG_USER_PERMISSIONS_FAIL,
          payload: `User [${handle}] not found`
        });
        return;
      }
      const uid = userDoc.docs[0].get("uid");

      const docRef = firestore.collection("org_users").doc(`${org_handle}_${uid}`);

      await docRef.update({
        permissions: newPermissions,
        updated_by: actor_uid
      });

      await getOrgUserData(org_handle)(firestore, dispatch);
      dispatch({ type: actions.UPDATE_ORG_USER_PERMISSIONS_SUCCESS });
    } catch (e) {
      dispatch({ type: actions.UPDATE_ORG_USER_PERMISSIONS_FAIL, payload: e.message });
    }
  };
