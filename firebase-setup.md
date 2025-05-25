# Firebase Setup Instructions for Portall App

## ✅ Firebase Configuration Complete
Your Firebase project is already configured with these credentials:
- **Project ID**: portall-app
- **Auth Domain**: portall-app.firebaseapp.com
- **API Key**: AIzaSyDHOj47SO29GvcKiG3APo9slpWD53GGiXQ

## Required Firebase Console Setup

### 1. Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/project/portall-app)
2. Navigate to **Authentication** → **Sign-in method**
3. Enable **Email/Password** provider
4. Click **Save**

### 2. Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules next)
4. Select your preferred location
5. Click **Done**

### 3. Configure Security Rules
Go to **Firestore Database** → **Rules** and paste this code:

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


### 4. Test Your Setup
1. Open your Portall app
2. Try registering a new user
3. Login with the created account
4. Add a visitor to test Firestore integration

## 🚀 Your app is now ready for production!
