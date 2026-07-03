const { db, admin } = require("../auth");

/**
 * Triggered when a follow document is created in user_followers/{docId}.
 * Document ID format: "{followingId}_{followerId}"
 * Document data: { followingId, followerId }
 */
exports.onFollowCreate = async (snapshot, context) => {
  try {
    const data = snapshot.data();
    const followerId = data.followerId;
    const followingId = data.followingId;

    if (!followerId || !followingId || followerId === followingId) {
      return console.log("Skipping self-follow notification");
    }

    const followerDoc = await db.collection("cl_user").doc(followerId).get();
    const followerName = followerDoc.exists
      ? followerDoc.get("displayName") || "Someone"
      : "Someone";

    const ref = await db.collection("cl_notifications").add({
      recipient_uid: followingId,
      type: "follow",
      content: `${followerName} started following you`,
      username: followerName,
      org: "",
      tutorial_id: null,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await ref.update({ notification_id: ref.id });

    return console.log(`Follow notification created for ${followingId}`);
  } catch (e) {
    return console.error("onFollowCreate error:", e.message);
  }
};

/**
 * Triggered when a comment document is created in tutorials/{tutorialId}/comments/{commentId}.
 */
exports.onCommentCreate = async (snapshot, context) => {
  try {
    const { tutorialId } = context.params;
    const commentData = snapshot.data();
    const commenterUid = commentData.created_by || commentData.uid;
    const commenterName = commentData.username || commentData.displayName || "Someone";

    const tutorialDoc = await db.collection("tutorials").doc(tutorialId).get();
    if (!tutorialDoc.exists) {
      return console.log(`Tutorial ${tutorialId} not found, skipping notification`);
    }

    const authorUid = tutorialDoc.get("created_by");
    const tutorialTitle = tutorialDoc.get("title") || "a tutorial";

    if (!authorUid || commenterUid === authorUid) {
      return console.log("Skipping self-comment notification");
    }

    const ref = await db.collection("cl_notifications").add({
      recipient_uid: authorUid,
      type: "comment",
      content: `${commenterName} commented on "${tutorialTitle}"`,
      username: commenterName,
      org: "",
      tutorial_id: tutorialId,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await ref.update({ notification_id: ref.id });

    return console.log(`Comment notification created for ${authorUid}`);
  } catch (e) {
    return console.error("onCommentCreate error:", e.message);
  }
};

/**
 * Triggered when a new member document is created in org_users/{memberDoc}.
 * Notifies all existing owners of the organisation.
 */
exports.onOrgMemberJoin = async (snapshot, context) => {
  try {
    const { uid: newMemberUid, org_handle, permissions } = snapshot.data();

    // Skip if joining user is already owner (permissions: [3])
    if (permissions && permissions[0] === 3) {
      return console.log("Skipping owner self-join notification");
    }

    const newMemberDoc = await db.collection("cl_user").doc(newMemberUid).get();
    const newMemberName = newMemberDoc.exists
      ? newMemberDoc.get("displayName") || "Someone"
      : "Someone";

    const ownersSnap = await db
      .collection("org_users")
      .where("org_handle", "==", org_handle)
      .where("permissions", "array-contains", 3)
      .get();

    if (ownersSnap.empty) {
      return console.log(`No owners found for org ${org_handle}`);
    }

    const writes = ownersSnap.docs
      .map(ownerDoc => {
        const ownerUid = ownerDoc.get("uid");
        if (ownerUid === newMemberUid) return null; 
        return db.collection("cl_notifications").add({
          recipient_uid: ownerUid,
          type: "org_join",
          content: `${newMemberName} joined your organization ${org_handle}`,
          username: newMemberName,
          org: org_handle,
          tutorial_id: null,
          isRead: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }).then(ref => ref.update({ notification_id: ref.id }));
      })
      .filter(Boolean);

    await Promise.all(writes);
    return console.log(`Org join notifications created for org ${org_handle}`);
  } catch (e) {
    return console.error("onOrgMemberJoin error:", e.message);
  }
};

/**
 * Triggered when a notification document is created.
 * Sends an FCM push notification to all of the recipient's registered devices.
 */
exports.onNotificationCreate = async (snapshot, context) => {
  try {
    const { recipient_uid, content } = snapshot.data();

    if (!recipient_uid) {
      return console.log("No recipient_uid, skipping FCM send");
    }

    const userDoc = await db.collection("cl_user").doc(recipient_uid).get();
    if (!userDoc.exists) {
      return console.log(`User ${recipient_uid} not found, skipping FCM send`);
    }

    const fcmTokens = userDoc.get("fcmTokens");
    if (!fcmTokens || fcmTokens.length === 0) {
      return console.log(`No FCM tokens for ${recipient_uid}, skipping push`);
    }

    const message = {
      notification: {
        title: "Codelabz",
        body: content || "You have a new notification"
      },
      tokens: fcmTokens
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`FCM sent: ${response.successCount} success, ${response.failureCount} failed`);

    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (
        !resp.success &&
        resp.error &&
        resp.error.code === "messaging/registration-token-not-registered"
      ) {
        invalidTokens.push(fcmTokens[idx]);
      }
    });

    if (invalidTokens.length > 0) {
      await db.collection("cl_user").doc(recipient_uid).update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens)
      });
      console.log(`Removed ${invalidTokens.length} stale FCM tokens for ${recipient_uid}`);
    }

    return null;
  } catch (e) {
    return console.error("onNotificationCreate error:", e.message);
  }
};
