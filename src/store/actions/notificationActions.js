import * as actions from "./actionTypes";
import { messaging } from "../../config";

let notificationUnsubscribe = null;

export const subscribeToNotifications = uid => (firebase, dispatch) => {
  if (notificationUnsubscribe) {
    notificationUnsubscribe();
    notificationUnsubscribe = null;
  }

  const db = firebase.firestore();
  notificationUnsubscribe = db
    .collection("cl_notifications")
    .where("recipient_uid", "==", uid)
    .limit(50)
    .onSnapshot(
      snapshot => {
        const notifications = snapshot.docs
          .map(doc => ({ notification_id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate?.()?.getTime() ?? 0;
            const bTime = b.createdAt?.toDate?.()?.getTime() ?? 0;
            return bTime - aTime;
          });
        dispatch({ type: actions.GET_NOTIFICATION_DATA_SUCCESS, payload: notifications });
      },
      error => {
        console.error("Notification listener error:", error.message);
        dispatch({ type: actions.GET_NOTIFICATION_DATA_FAIL, payload: error.message });
      }
    );
};

export const unsubscribeFromNotifications = () => dispatch => {
  if (notificationUnsubscribe) {
    notificationUnsubscribe();
    notificationUnsubscribe = null;
  }
  dispatch({ type: actions.UNSUBSCRIBE_NOTIFICATIONS });
};

export const markAllNotificationsRead = uid => async (firebase, firestore, dispatch) => {
  try {
    dispatch({ type: actions.MARK_ALL_NOTIFICATIONS_READ_START });

    const snapshot = await firestore
      .collection("cl_notifications")
      .where("recipient_uid", "==", uid)
      .where("isRead", "==", false)
      .get();

    if (snapshot.empty) {
      dispatch({ type: actions.MARK_ALL_NOTIFICATIONS_READ_SUCCESS });
      return;
    }

    const db = firebase.firestore();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.update(doc.ref, { isRead: true }));
    await batch.commit();

    dispatch({ type: actions.MARK_ALL_NOTIFICATIONS_READ_SUCCESS });
  } catch (e) {
    console.error("markAllNotificationsRead error:", e.message);
    dispatch({ type: actions.MARK_ALL_NOTIFICATIONS_READ_FAIL, payload: e.message });
  }
};

export const saveFcmToken = uid => async (firebase, firestore, dispatch) => {
  try {
    if (!messaging) return;

    dispatch({ type: actions.SAVE_FCM_TOKEN_START });

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const vapidKey = import.meta.env.VITE_APP_FIREBASE_FCM_VAPID_KEY;
    const { getToken } = await import("firebase/messaging");
    const token = await getToken(messaging, { vapidKey });

    if (token) {
      await firestore.collection("cl_user").doc(uid).update({
        fcmTokens: firebase.firestore.FieldValue.arrayUnion(token)
      });
      sessionStorage.setItem("fcm_token", token);
      dispatch({ type: actions.SAVE_FCM_TOKEN_SUCCESS });
    }
  } catch (e) {
    console.error("saveFcmToken error:", e.message);
    dispatch({ type: actions.SAVE_FCM_TOKEN_FAIL, payload: e.message });
  }
};

export const removeFcmToken = (uid, token) => async (firebase, firestore) => {
  if (!token || !uid) return;
  try {
    await firestore.collection("cl_user").doc(uid).update({
      fcmTokens: firebase.firestore.FieldValue.arrayRemove(token)
    });
  } catch (e) {
    console.error("removeFcmToken error:", e.message);
  }
};
