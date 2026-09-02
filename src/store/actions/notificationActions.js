import * as actions from "./actionTypes";
import { messaging } from "../../config";

let notificationUnsubscribe = null;

/**
 * Writes a notification doc directly from the client — no Cloud Function
 * trigger involved, so this stays on the free Firestore plan. Delivery to
 * the recipient happens via their subscribeToNotifications onSnapshot listener.
 */
export const createNotification = async (
  firestore,
  {
    recipient_uid,
    sender_uid,
    type,
    content,
    username,
    org = "",
    tutorial_id = null
  }
) => {
  if (!recipient_uid || recipient_uid === sender_uid) return;
  try {
    // The id is generated up front and written with the document. Stamping it
    // in a follow-up update cannot work: rules only let the recipient update a
    // notification, and the sender is never the recipient here because the
    // guard above returns early in that case, so that second write was always
    // rejected and the field never landed.
    const ref = firestore.collection("cl_notifications").doc();
    await ref.set({
      notification_id: ref.id,
      recipient_uid,
      type,
      content,
      username,
      org,
      tutorial_id,
      isRead: false,
      createdAt: firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.error(`createNotification (${type}) error:`, e.message);
  }
};

export const subscribeToNotifications = uid => (firebase, dispatch) => {
  try {
    if (notificationUnsubscribe) {
      notificationUnsubscribe();
      notificationUnsubscribe = null;
    }

    dispatch({ type: actions.SUBSCRIBE_NOTIFICATIONS_START });

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
          dispatch({
            type: actions.SUBSCRIBE_NOTIFICATIONS_SUCCESS,
            payload: notifications
          });
        },
        error => {
          console.error("Notification listener error:", error.message);
          dispatch({
            type: actions.SUBSCRIBE_NOTIFICATIONS_FAIL,
            payload: error.message
          });
        }
      );
  } catch (e) {
    console.error("subscribeToNotifications error:", e.message);
    dispatch({
      type: actions.SUBSCRIBE_NOTIFICATIONS_FAIL,
      payload: e.message
    });
  }
};

export const unsubscribeFromNotifications =
  uid => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.UNSUBSCRIBE_NOTIFICATIONS_START });

      if (notificationUnsubscribe) {
        notificationUnsubscribe();
        notificationUnsubscribe = null;
      }

      // Drop this device's FCM token so the user stops receiving pushes here.
      const token = sessionStorage.getItem("fcm_token");
      if (uid && token) {
        await removeFcmToken(uid, token)(firebase, firestore);
      }
      sessionStorage.removeItem("fcm_token");
      sessionStorage.removeItem("fcm_requested");

      dispatch({ type: actions.UNSUBSCRIBE_NOTIFICATIONS_SUCCESS });
    } catch (e) {
      console.error("unsubscribeFromNotifications error:", e.message);
      dispatch({
        type: actions.UNSUBSCRIBE_NOTIFICATIONS_FAIL,
        payload: e.message
      });
    }
  };

export const markAllNotificationsRead =
  uid => async (firebase, firestore, dispatch) => {
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
      dispatch({
        type: actions.MARK_ALL_NOTIFICATIONS_READ_FAIL,
        payload: e.message
      });
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
      await firestore
        .collection("cl_user")
        .doc(uid)
        .update({
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
    await firestore
      .collection("cl_user")
      .doc(uid)
      .update({
        fcmTokens: firebase.firestore.FieldValue.arrayRemove(token)
      });
  } catch (e) {
    console.error("removeFcmToken error:", e.message);
  }
};
