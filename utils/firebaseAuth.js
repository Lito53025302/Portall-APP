async function signInUser(email, password) {
    try {
        const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
        console.log('User signed in successfully:', result.user.email);
        return result.user;
    } catch (error) {
        console.error('Sign in error:', error);
        let errorMessage = 'Login failed';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Try again later';
                break;
            default:
                errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
}

async function registerUser(email, password, userData) {
    try {
        const result = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        console.log('User registered successfully:', result.user.email);
        
        // Create user profile in Firestore
        await firebaseDb.collection('users').doc(result.user.uid).set({
            ...userData,
            email: result.user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            role: userData.userType
        });
        
        console.log('User profile created in Firestore');
        return result.user;
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password should be at least 6 characters';
                break;
            default:
                errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
    }
}

async function signOutUser() {
    try {
        await firebaseAuth.signOut();
        console.log('User signed out successfully');
        return true;
    } catch (error) {
        console.error('Sign out error:', error);
        throw new Error('Logout failed: ' + error.message);
    }
}

function getCurrentUser() {
    return firebaseAuth.currentUser;
}

// Auth state observer
function onAuthStateChanged(callback) {
    return firebaseAuth.onAuthStateChanged(callback);
}
