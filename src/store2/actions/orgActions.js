import _ from "lodash";
import { useFirebase } from "react-redux-firebase";
import Elasticlunr from "../../helpers/elasticlunr";
import * as actions from "./actionTypes";
import { checkOrgHandleExists } from "./authActions";

const elasticlunr = new Elasticlunr("handle", "handle", "name");

export const searchFromIndex = query => {
  return elasticlunr.searchFromIndex(query);
};

export const getOrgUserData = org_handle => async (firestore, dispatch) => {
  try {
    dispatch({ type: actions.GET_ORG_USER_DATA_START });
    const usersDoc = await firestore
      .collection("cl_org_general")
      .doc(org_handle)
      .collection("cl_org_users")
      .doc("users")
      .get();
    const usersData = usersDoc.data();
    const users = _.omit(usersData, ["createdAt", "updatedAt"]);
    const promises = Object.keys(users).map(async uid => {
      let userDoc = await firestore.collection("cl_user").doc(uid).get();
      return {
        name: userDoc.get("displayName"),
        handle: userDoc.get("handle"),
        image: userDoc.get("photoURL"),
        permission_level: users[uid]
      };
    });
    const userData = await Promise.all(promises);
    dispatch({
      type: actions.GET_ORG_USER_DATA_SUCCESS,
      payload: _.orderBy(userData, ["permission_level"], ["desc"])
    });
    userData.forEach(doc => {
      elasticlunr.addDocToIndex(doc);
    });
  } catch (e) {
    dispatch({ type: actions.GET_ORG_USER_DATA_FAIL, payload: e.message });
  }
};

export const addOrgUser =
  ({ org_handle, handle, permissions }) =>
  async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.ADD_ORG_USER_START });
      const userDoc = await firestore
        .collection("cl_user")
        .where("handle", "==", handle)
        .get();
      if (userDoc.docs.length === 1) {
        const uid = userDoc.docs[0].get("uid");
        await firestore
          .collection("cl_org_general")
          .doc(org_handle)
          .collection("cl_org_users")
          .doc("users")
          .update({
            [uid]: [permissions],
            updatedAt: firestore.FieldValue.serverTimestamp()
          });

        await getOrgUserData(org_handle)(firestore, dispatch);
        dispatch({ type: actions.ADD_ORG_USER_SUCCESS });
      } else {
        dispatch({
          type: actions.ADD_ORG_USER_FAIL,
          payload: `User [${handle}] is not registered with CodeLabz`
        });
      }
    } catch (e) {
      dispatch({ type: actions.ADD_ORG_USER_FAIL, payload: e.message });
    }
  };

export const removeOrgUser =
  ({ org_handle, handle }) =>
  async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.ADD_ORG_USER_START });
      const userDoc = await firestore
        .collection("cl_user")
        .where("handle", "==", handle)
        .get();
      if (userDoc.docs.length === 1) {
        const uid = userDoc.docs[0].get("uid");
        await firestore
          .collection("cl_org_general")
          .doc(org_handle)
          .collection("cl_org_users")
          .doc("users")
          .update({
            [uid]: firestore.FieldValue.delete(),
            updatedAt: firestore.FieldValue.serverTimestamp()
          });

        await getOrgUserData(org_handle)(firestore, dispatch);
        dispatch({ type: actions.ADD_ORG_USER_SUCCESS });
      } else {
        dispatch({
          type: actions.ADD_ORG_USER_FAIL,
          payload: `User [${handle}] is not registered with CodeLabz`
        });
      }
    } catch (e) {
      dispatch({ type: actions.ADD_ORG_USER_FAIL, payload: e.message });
    }
  };


  export const removeOrgUsers = (role,orgUserHandle,org_handle) => async(firebase,dispatch)=>{
    try{
      if (role == "admin"){
        dispatch({ type: actions.REMOVE_ORG_USER_START });
        const adminCollection = firebase
          .firestore()
          .collection("cl_org_general")
          .doc(org_handle)
          .collection("admins")

        
          const querySnapShot = await adminCollection.where("adminHandle","==",orgUserHandle).get()
          querySnapShot.forEach(async (doc) =>{
            await adminCollection.doc(doc.id).delete();

          })
          const querySnapshotAfter = await adminCollection.get();
          const records = querySnapshotAfter.docs.map(doc => doc.data())
          const modifiedRecords = records.map((obj) => {
            return {
              ...obj,
              avatar: {
                type: "image",
                value: "https://i.pravatar.cc/300",
              },
            };
          });
          dispatch({ type: actions.REMOVE_ORG_USER_SUCCESS });
          return modifiedRecords;
      }else{
        const contributorCollection = firebase
        .firestore()
        .collection("cl_org_general")
        .doc(org_handle)
        .collection("contributors");

        const querySnapShot = await contributorCollection.where("contributorHandle","==",orgUserHandle).get()

        querySnapShot.forEach(async (doc) =>{
          await contributorCollection.doc(doc.id).delete();
        })
        const querySnapshotAfter = await contributorCollection.get();
        const records = querySnapshotAfter.docs.map(doc => doc.data())
        const modifiedRecords = records.map((obj) => {
          return {
            ...obj,
            avatar: {
              type: "image",
              value: "https://i.pravatar.cc/300",
            },
          };
        });
        dispatch({ type: actions.REMOVE_ORG_USER_SUCCESS });
        return modifiedRecords;
      }
    }catch(e){
      dispatch({ type: actions.REMOVE_ORG_USER_FAIL });
      throw e.message;
    }
  }

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

    const org_name = orgDoc.get("org_name");
    const org_image = orgDoc.get("org_image");
    const org_link_facebook = orgDoc.get("org_link_facebook");
    const org_link_github = orgDoc.get("org_link_github");
    const org_link_linkedin = orgDoc.get("org_link_linkedin");
    const org_link_twitter = orgDoc.get("org_link_twitter");
    const org_website = orgDoc.get("org_website");
    const org_published = orgDoc.get("org_published");
    const org_description = orgDoc.get("org_description");
    const org_country = orgDoc.get("org_country");

    const orgPermissionDoc = await firestore
      .collection("cl_org_general")
      .doc(org_handle)
      .collection("cl_org_users")
      .doc("users")
      .get();

    if (!orgPermissionDoc.exists) return null;

    const user_permissions = orgPermissionDoc.get(uid);

    if (!user_permissions) return null;

    return {
      org_handle,
      org_name,
      org_link_facebook,
      org_link_github,
      org_link_linkedin,
      org_link_twitter,
      org_website,
      org_published,
      org_description,
      org_country,
      org_image: org_image ? org_image : "",
      permissions: user_permissions
    };
  } catch (e) {
    throw e;
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

export const clearEditGeneral = () => (dispatch) => {
  dispatch({ type: actions.CLEAR_EDIT_ORG_GENERAL });
};

export const unPublishOrganization =
  (org_handle, published, currentOrgData) =>
  async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.EDIT_ORG_GENERAL_START });
      await firestore.collection("cl_org_general").doc(org_handle).update({
        org_published: !published,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      const newData = await getOrgBasicData(org_handle)(firebase);
      const update = _.unionBy([newData], currentOrgData, "org_handle");
      dispatch({
        type: actions.GET_PROFILE_DATA_SUCCESS,
        payload: { organizations: _.orderBy(update, ["org_handle"], ["asc"]) },
      });

      dispatch({ type: actions.EDIT_ORG_GENERAL_SUCCESS });
    } catch (e) {
      dispatch({ type: actions.EDIT_ORG_GENERAL_FAIL, payload: e.message });
    }
  };


export const addOrgAdmins = (org_handle,adminHandle,adminEmail,adminDesignation)=> async(firestore,dispatch)=>{
    try{
      dispatch({ type: actions.ADD_ORG_ADMIN_START });
      await firestore.collection("cl_org_general").doc(org_handle).collection("admins").add({
        adminHandle,
        adminEmail,
        adminDesignation
      })
      dispatch({ type: actions.ADD_ORG_ADMIN_SUCCESS });
    }
    
    catch(e){
      dispatch({ type: actions.ADD_ORG_ADMIN_FAIL, payload: e.message });
      throw e.message;
    }
  }

  export const addOrgContributors = (org_handle,contributorHandle,contributorEmail,contributorDesignation)=> async(firestore,dispatch)=>{
    try{
      dispatch({ type: actions.ADD_ORG_CONTRIBUTOR_START });
      await firestore.collection("cl_org_general").doc(org_handle).collection("contributors").add({
        contributorHandle,
        contributorEmail,
        contributorDesignation
      })
      dispatch({ type: actions.ADD_ORG_CONTRIBUTOR_SUCCESS });
    }
    
    catch(e){
      dispatch({ type: actions.ADD_ORG_CONTRIBUTOR_FAIL, payload: e.message });
      throw e.message;
    }
  }

export const fetchAdmins = (org_handle) => async(firebase,dispatch) => {
  try{
    dispatch({ type: actions.FETCH_ADMIN_DETAILS_START });
    const handle = await firebase
      .firestore()
      .collection("cl_org_general")
      .doc(org_handle)
      .collection("admins")
      .get()

    const records = handle.docs.map(doc => doc.data())
    const modifiedRecords = records.map((obj) => {
      return {
        ...obj,
        avatar: {
          type: "image",
          value: "https://i.pravatar.cc/300",
        },
      };
    });
    dispatch({ type: actions.FETCH_ADMIN_DETAILS_SUCCESS });
    return modifiedRecords;
  }catch(e){
    dispatch({ type: actions.FETCH_ADMIN_DETAILS_FAIL });
    throw e.message;
  }
}

export const fetchContributors = (org_handle) => async(firebase,dispatch) => {
  try{
    dispatch({ type: actions.FETCH_CONTRIBUTOR_DETAILS_START });
    const handle = await firebase
      .firestore()
      .collection("cl_org_general")
      .doc(org_handle)
      .collection("contributors")
      .get()

    const records = handle.docs.map(doc => doc.data())
    const modifiedRecords = records.map((obj) => {
      return {
        ...obj,
        avatar: {
          type: "image",
          value: "https://i.pravatar.cc/300",
        },
      };
    });
    dispatch({ type: actions.FETCH_CONTRIBUTOR_DETAILS_SUCCESS });
    return modifiedRecords;
  }catch(e){
    dispatch({ type: actions.FETCH_CONTRIBUTOR_DETAILS_FAIL });
    throw e.message;
  }
}


export const uploadOrgProfileImage =
  (file, org_handle, currentOrgData) => async (firebase, dispatch) => {
    try {
      const storagePath = `organizations/${org_handle}/images`;
      const dbPath = "cl_org_general";
      await firebase.uploadFile(storagePath, file, dbPath, {
        metadataFactory: (uploadRes, firebase, metadata, downloadURL) => {
          return { org_image: downloadURL };
        },
        documentId: org_handle,
      });

      const newData = await getOrgBasicData(org_handle)(firebase);
      const update = _.unionBy([newData], currentOrgData, "org_handle");
      dispatch({
        type: actions.GET_PROFILE_DATA_SUCCESS,
        payload: { organizations: _.orderBy(update, ["org_handle"], ["asc"]) },
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

      const isOrgExists = await checkOrgHandleExists(org_handle)(firebase);

      if (isOrgExists) {
        const doc = await firestore
          .collection("cl_org_general")
          .doc(org_handle)
          .get();
        const isPublished =
          organizations.includes(org_handle) || doc.get("org_published");

        if (isPublished) {
          dispatch({ type: actions.GET_ORG_DATA_SUCCESS, payload: doc.data() });
        } else {
          dispatch({ type: actions.GET_ORG_DATA_SUCCESS, payload: false });
        }
      } else {
        dispatch({ type: actions.GET_ORG_DATA_SUCCESS, payload: false });
      }
    } catch (e) {
      dispatch({ type: actions.GET_ORG_DATA_FAIL, payload: e.message });
    }
  };

export const clearOrgData = () => (dispatch) => {
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
    ).docs.map((doc) => doc.data());

    dispatch({ type: actions.GET_LAUNCHED_ORGS_SUCCESS, payload: lauchedOrgs });
  } catch (e) {
    dispatch({ type: actions.GET_LAUNCHED_ORGS_FAIL, payload: e.message });
  }
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
  (val, people, handle, orgFollowed, profileId) => (firestore, dispatch) => {
    console.log("test");
    try {
      var filteredFollowers = people.filter(function (value, index, arr) {
        return value !== val;
      });
      firestore.collection("cl_org_general").doc(handle).update({
        followers: filteredFollowers,
      });
      var Orgfiltered = orgFollowed.filter(function (value, index, arr) {
        return handle !== value;
      });
      firestore.collection("cl_user").doc(profileId).update({
        orgFollowed: Orgfiltered,
      });
    } catch (e) {
      console.log(e);
    }
  };

export const addFollower =
  (value, people, handle, orgFollowed, profileId) => (firestore, dispatch) => {
    try {
      if (people && people.includes(value)) {
        console.log("already followed");
      } else if (people) {
        const arr = [...people];
        arr.push(value);
        firestore.collection("cl_org_general").doc(handle).update({
          followers: arr,
        });
        var arr2 = [];
        if (orgFollowed) arr2 = [...orgFollowed];

        arr2.push(handle);
        firestore.collection("cl_user").doc(profileId).update({
          orgFollowed: arr2,
        });
      } else {
        firestore
          .collection("cl_user")
          .doc(profileId)
          .update({
            orgFollowed: [handle],
          });
        firestore
          .collection("cl_org_general")
          .doc(handle)
          .update({
            followers: [value],
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

export const deleteOrganization = (org_handle) => async (firebase = useFirebase(), dispatch) => {
  try {
    const auth = firebase.auth().currentUser;
    // remove org from the organization collection
    await firebase.firestore().collection("cl_org_general").doc(org_handle).delete();

    // remove org from the user's orgs
    await firebase.firestore().collection('cl_user').doc(auth.uid).update({
      organizations: firebase.firestore.FieldValue.arrayRemove(org_handle)
    });
    dispatch({ type: actions.CLEAR_ORG_GENERAL_STATE });
    dispatch({ type: actions.CLEAR_ORG_USER_STATE });
  } catch (e) {
    console.log(e);
  }
}