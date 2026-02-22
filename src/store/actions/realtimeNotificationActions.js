import * as actions from "./actionTypes";

/**
 * Subscribe to real-time notification updates using Firestore onSnapshot.
 * This replaces the one-time getNotificationData() fetch with a persistent
 * listener that dispatches updates whenever the notifications collection changes.
 *
 * @returns {Function} Redux thunk action
 */
export const subscribeToNotifications =
    () => (firebase, firestore, dispatch) => {
        try {
            // Avoid duplicate listeners
            dispatch({ type: actions.GET_NOTIFICATION_DATA_START });

            const unsubscribe = firestore
                .collection("notifications")
                .orderBy("createdAt", "desc")
                .onSnapshot(
                    snapshot => {
                        const notifications = snapshot.docs.map(doc => doc.data());
                        dispatch({
                            type: actions.GET_NOTIFICATION_DATA_SUCCESS,
                            payload: notifications
                        });
                    },
                    error => {
                        console.error("Notification listener error:", error);
                        dispatch({
                            type: actions.GET_NOTIFICATION_DATA_FAIL,
                            payload: error.message
                        });
                    }
                );

            // Store the unsubscribe function so we can clean up later
            dispatch({
                type: actions.NOTIFICATION_LISTENER_SET,
                payload: unsubscribe
            });
        } catch (e) {
            console.error("Failed to subscribe to notifications:", e);
            dispatch({
                type: actions.GET_NOTIFICATION_DATA_FAIL,
                payload: e.message
            });
        }
    };

/**
 * Unsubscribe from real-time notification updates.
 * Should be called on logout or when the listener is no longer needed.
 *
 * @param {Function} unsubscribe - The unsubscribe function returned by onSnapshot
 * @returns {Function} Redux thunk action
 */
export const unsubscribeFromNotifications = unsubscribe => dispatch => {
    try {
        if (unsubscribe && typeof unsubscribe === "function") {
            unsubscribe();
        }
        dispatch({ type: actions.NOTIFICATION_LISTENER_UNSUBSCRIBED });
    } catch (e) {
        console.error("Failed to unsubscribe from notifications:", e);
    }
};
