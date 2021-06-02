const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

exports.addLike = functions.firestore
    .document("/Posts/{postId}/Likes/{userId}")
    .onCreate((data, context) => {
      return db
          .collection("Posts")
          .doc(context.params.postId)
          .update({
            likes: admin.firestore.FieldValue.increment(1),
          });
    });

exports.disLike = functions.firestore
    .document("/Posts/{postId}/Likes/{userId}")
    .onDelete((data, context) => {
      return db
          .collection("Posts")
          .doc(context.params.postId)
          .update({
            likes: admin.firestore.FieldValue.increment(-1),
          });
    });

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
