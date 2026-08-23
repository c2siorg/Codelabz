import * as actions from "./actionTypes";


export const getAdminStats = () => async (firestore, dispatch) => {
  try {
    dispatch({ type: actions.GET_ADMIN_STATS_START });

    const [usersSnap, orgsSnap, tutorialsSnap] = await Promise.all([
      firestore.collection("cl_user").get(),
      firestore.collection("cl_org_general").get(),
      firestore.collection("tutorials").get()
    ]);

    dispatch({
      type: actions.GET_ADMIN_STATS_SUCCESS,
      payload: {
        totalUsers: usersSnap.size,
        totalOrgs: orgsSnap.size,
        totalTutorials: tutorialsSnap.size
      }
    });
  } catch (e) {
    dispatch({ type: actions.GET_ADMIN_STATS_FAIL, payload: e.message });
  }
};


export const getAdminOrgs = () => async (firestore, dispatch) => {
  try {
    dispatch({ type: actions.GET_ADMIN_ORGS_START });

    const orgsSnap = await firestore
      .collection("cl_org_general")
      .orderBy("createdAt", "desc")
      .get();

    const orgDocs = orgsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch member and tutorial counts in parallel for each org
    const enriched = await Promise.all(
      orgDocs.map(async org => {
        try {
          const [membersSnap, tutorialsSnap] = await Promise.all([
            firestore
              .collection("org_users")
              .where("org_handle", "==", org.org_handle)
              .get(),
            firestore
              .collection("tutorials")
              .where("org_handle", "==", org.org_handle)
              .get()
          ]);
          return {
            ...org,
            memberCount: membersSnap.size,
            tutorialCount: tutorialsSnap.size
          };
        } catch {
          return { ...org, memberCount: 0, tutorialCount: 0 };
        }
      })
    );

    dispatch({
      type: actions.GET_ADMIN_ORGS_SUCCESS,
      payload: {
        recentOrgs: enriched.slice(0, 10),
        allOrgs: enriched
      }
    });
  } catch (e) {
    dispatch({ type: actions.GET_ADMIN_ORGS_FAIL, payload: e.message });
  }
};


export const getAdminUsers = () => async (firestore, dispatch) => {
  try {
    dispatch({ type: actions.GET_ADMIN_USERS_START });

    const usersSnap = await firestore
      .collection("cl_user")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    dispatch({ type: actions.GET_ADMIN_USERS_SUCCESS, payload: users });
  } catch (e) {
    dispatch({ type: actions.GET_ADMIN_USERS_FAIL, payload: e.message });
  }
};


export const forceUnpublishOrg = org_handle => async (firestore, dispatch) => {
  try {
    await firestore.collection("cl_org_general").doc(org_handle).update({
      org_published: false,
      updatedAt: firestore.FieldValue.serverTimestamp()
    });
    // Refresh the org list
    dispatch(getAdminOrgs());
  } catch (e) {
    console.error("forceUnpublishOrg failed:", e);
  }
};


export const getOrgAuditLog =
  (org_handle, limit = 20) =>
  async (firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_ORG_AUDIT_LOG_START });

      const snap = await firestore
        .collection("org_role_audit")
        .where("org_handle", "==", org_handle)
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get();

      const entries = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      dispatch({ type: actions.GET_ORG_AUDIT_LOG_SUCCESS, payload: entries });
    } catch (e) {
      dispatch({ type: actions.GET_ORG_AUDIT_LOG_FAIL, payload: e.message });
    }
  };
