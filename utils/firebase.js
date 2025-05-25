// Firebase configuration with your actual credentials
const firebaseConfig = {
    apiKey: "AIzaSyDHOj47SO29GvcKiG3APo9slpWD53GGiXQ",
    authDomain: "portall-app.firebaseapp.com",
    projectId: "portall-app",
    storageBucket: "portall-app.firebasestorage.app",
    messagingSenderId: "529429644385",
    appId: "1:529429644385:web:e05b075739e22b08aed620",
    measurementId: "G-F0RH9825QH"
};

// Initialize Firebase
let firebaseApp, auth, db;

try {
    // Initialize Firebase app
    firebaseApp = firebase.initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = firebase.auth();
    db = firebase.firestore();
    
    console.log('Firebase initialized successfully with portall-app');
} catch (error) {
    console.error('Firebase initialization error:', error);
    
    // Fallback to simulated Firebase for development
    firebaseApp = {
        auth: () => ({
            signInWithEmailAndPassword: async (email, password) => {
                return { user: { uid: 'demo-uid', email } };
            },
            createUserWithEmailAndPassword: async (email, password) => {
                return { user: { uid: 'demo-uid', email } };
            },
            signOut: async () => true,
            currentUser: null,
            onAuthStateChanged: (callback) => {
                callback(null);
                return () => {};
            }
        }),
        firestore: () => ({
            collection: (name) => ({
                doc: (id) => ({
                    set: async (data) => ({ id }),
                    get: async () => ({ exists: true, data: () => data }),
                    update: async (data) => ({ id })
                }),
                add: async (data) => ({ id: 'demo-id' }),
                where: (field, op, value) => ({
                    orderBy: (field, direction) => ({
                        get: async () => ({ docs: [] })
                    }),
                    limit: (num) => ({
                        get: async () => ({ docs: [] })
                    }),
                    get: async () => ({ docs: [] })
                })
            })
        })
    };
    
    auth = firebaseApp.auth();
    db = firebaseApp.firestore();
}

// Export Firebase services
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseApp = firebaseApp;
