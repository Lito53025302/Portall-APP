async function signInUser(email, password) {
    try {
        const result = await firebaseApp.auth.signInWithEmailAndPassword(email, password);
        return result.user;
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}

async function registerUser(email, password, userData) {
    try {
        const result = await firebaseApp.auth.createUserWithEmailAndPassword(email, password);
        
        // Create user profile in Firestore
        await firebaseApp.firestore.collection('users').doc(result.user.uid).set({
            ...userData,
            createdAt: new Date().toISOString(),
            role: userData.userType // 'resident' or 'guard'
        });
        
        return result.user;
    } catch (error) {
        throw new Error('Registration failed: ' + error.message);
    }
}

async function signOutUser() {
    try {
        await firebaseApp.auth.signOut();
        return true;
    } catch (error) {
        throw new Error('Logout failed: ' + error.message);
    }
}

function getCurrentUser() {
    return firebaseApp.auth.currentUser;
}
