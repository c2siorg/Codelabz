import * as functions from "firebase-functions";
import * as dotenv from "dotenv";

dotenv.config({
  path: "../.env"
});

const onCallFunctions = require("../cloud_functions/onCallFunctions");
const onCreateFunctions = require("../cloud_functions/onCreateFunctions");
const onWriteFunctions = require("../cloud_functions/onWriteFunctions");
const onUpdateFunctions = require("../cloud_functions/onUpdateFunctions");
const pubSubFunctions = require("../cloud_functions/pubSubFunctions");
const { db } = require("../auth");

const TUTORIALS_COLLECTION = "tutorials";
const USERS_COLLECTION = "users";
const BATCH_LIMIT = 500;

type UserProfile = {
  displayName?: string | null;
  photoURL?: string | null;
};

const normalizeProfileField = (value: unknown): string | null => {
  return typeof value === "string" ? value : null;
};

// Existing onCall functions
export const resendVerificationEmail = functions.https.onCall(
  onCallFunctions.resendVerificationEmailHandler
);

export const sendPasswordUpdateEmail = functions.https.onCall(
  onCallFunctions.sendPasswordUpdateEmailHandler
);

// Existing onCreate functions
export const sendVerificationEmail = functions.auth
  .user()
  .onCreate(onCreateFunctions.sendVerificationEmailHandler);

export const createOrganization = functions.firestore
  .document("cl_org_general/{org_handle}")
  .onCreate(onCreateFunctions.createOrganizationHandler);

// Existing onWrite functions
export const registerUserHandle = functions.firestore
  .document("cl_user/{uid}")
  .onWrite(onWriteFunctions.registerUserHandleHandler);

// Existing onUpdate functions
export const updateOrgUser = functions.firestore
  .document("cl_org_general/{org_handle}/cl_org_users/users")
  .onUpdate(onUpdateFunctions.addOrgUserHandler);

// Existing pub/sub functions
export const deleteTutorialSteps = functions.pubsub
  .schedule("every 7 days")
  .onRun(pubSubFunctions.deleteTutorialStepsHandler);

// Hydrates tutorial author metadata on creation to reduce N+1 reads.
export const hydrateTutorialAuthorOnCreate = functions.firestore
  .document("tutorials/{tutorialId}")
  .onCreate(async (snapshot, context) => {
    try {
      const tutorial = snapshot.data();
      if (!tutorial) {
        console.warn("Missing tutorial data for created document.", {
          tutorialId: context.params.tutorialId
        });
        return null;
      }

      const authorId = tutorial.author_id;
      if (typeof authorId !== "string" || authorId.trim().length === 0) {
        console.log("Skipping author metadata hydration due to missing author_id.", {
          tutorialId: context.params.tutorialId
        });
        return null;
      }

      const userDoc = await db.collection(USERS_COLLECTION).doc(authorId).get();
      if (!userDoc.exists) {
        console.warn("Author document does not exist.", {
          tutorialId: context.params.tutorialId,
          authorId
        });
        return null;
      }

      const user = (userDoc.data() || {}) as UserProfile;
      const authorName = normalizeProfileField(user.displayName);
      const authorAvatarUrl = normalizeProfileField(user.photoURL);

      const mergeData: Record<string, string | null> = {};
      if (tutorial.author_name !== authorName) {
        mergeData.author_name = authorName;
      }
      if (tutorial.author_avatar_url !== authorAvatarUrl) {
        mergeData.author_avatar_url = authorAvatarUrl;
      }

      if (Object.keys(mergeData).length === 0) {
        return null;
      }

      await snapshot.ref.set(mergeData, { merge: true });
      return null;
    } catch (error) {
      console.error("Failed to hydrate tutorial author metadata.", {
        tutorialId: context.params.tutorialId,
        error
      });
      return null;
    }
  });

// Synchronizes denormalized tutorial author metadata when a user profile changes.
export const syncTutorialAuthorsOnUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    try {
      const before = (change.before.data() || {}) as UserProfile;
      const after = (change.after.data() || {}) as UserProfile;

      const previousDisplayName = normalizeProfileField(before.displayName);
      const previousPhotoUrl = normalizeProfileField(before.photoURL);
      const nextDisplayName = normalizeProfileField(after.displayName);
      const nextPhotoUrl = normalizeProfileField(after.photoURL);

      const targetFieldsChanged =
        previousDisplayName !== nextDisplayName ||
        previousPhotoUrl !== nextPhotoUrl;

      if (!targetFieldsChanged) {
        return null;
      }

      const userId = context.params.userId;
      const tutorialsSnapshot = await db
        .collection(TUTORIALS_COLLECTION)
        .where("author_id", "==", userId)
        .get();

      if (tutorialsSnapshot.empty) {
        return null;
      }

      let batch = db.batch();
      let batchOps = 0;
      const commits: Array<Promise<FirebaseFirestore.WriteResult[]>> = [];

      tutorialsSnapshot.docs.forEach((tutorialDoc: FirebaseFirestore.QueryDocumentSnapshot) => {
        const tutorial = tutorialDoc.data();
        const updateData: Record<string, string | null> = {};

        if (tutorial.author_name !== nextDisplayName) {
          updateData.author_name = nextDisplayName;
        }

        if (tutorial.author_avatar_url !== nextPhotoUrl) {
          updateData.author_avatar_url = nextPhotoUrl;
        }

        if (Object.keys(updateData).length === 0) {
          return;
        }

        batch.update(tutorialDoc.ref, updateData);
        batchOps += 1;

        if (batchOps === BATCH_LIMIT) {
          commits.push(batch.commit());
          batch = db.batch();
          batchOps = 0;
        }
      });

      if (batchOps > 0) {
        commits.push(batch.commit());
      }

      if (commits.length === 0) {
        return null;
      }

      await Promise.all(commits);
      return null;
    } catch (error) {
      console.error("Failed to synchronize tutorial author metadata.", {
        userId: context.params.userId,
        error
      });
      return null;
    }
  });
