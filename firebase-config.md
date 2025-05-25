# Firebase Configuration Instructions

## Step 1: Replace Firebase Config
In `utils/firebase.js`, replace the placeholder values with your actual Firebase credentials:

javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key-here",
    authDomain: "your-project-id.firebaseapp.com", 
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};


## Step 2: Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Copy your config from Project Settings

## Step 3: Firestore Security Rules
Copy and paste these rules in Firestore Rules tab:

javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    match /visitors/{visitorId} {
      allow create: if request.auth != null && request.resource.data.residentUid == request.auth.uid
                      && request.resource.data.tokenCreatedAt != null
                      && request.resource.data.tokenExpiresAt != null
                      && request.resource.data.status == "pendente";
      
      allow read: if request.auth != null;
      
      allow update: if request.auth != null && (
                      (resource.data.residentUid == request.auth.uid &&
                       request.resource.data.status == "saida_registrada" &&
                       request.resource.data.exitTimestamp != null) ||
                      (request.resource.data.status == "liberado" &&
                       request.resource.data.entryTimestamp != null &&
                       resource.data.tokenExpiresAt > request.time)
                    );
      allow delete: if false;
    }
  }
}


## Step 4: Test Connection
The app will automatically fall back to demo mode if Firebase isn't configured properly.
