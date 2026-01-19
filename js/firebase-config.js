/**
 * NEXUS AI - Firebase Configuration
 * Handles Firebase initialization and authentication
 */

// Firebase CDN imports are loaded in HTML
// This file initializes Firebase and provides auth functions

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwFysU1ZjQqg7s8BYfjbLmiCK5Vtwrt0Q",
    authDomain: "intuvia-86ce0.firebaseapp.com",
    projectId: "intuvia-86ce0",
    storageBucket: "intuvia-86ce0.firebasestorage.app",
    messagingSenderId: "1054543110389",
    appId: "1:1054543110389:web:eff9e2833b91ff1cf4e5bc"
};

// Allowed email for login
const ALLOWED_EMAIL = 'projectintuiva@gmail.com';

// Initialize Firebase
let app;
let auth;
let googleProvider;

function initFirebase() {
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        googleProvider = new firebase.auth.GoogleAuthProvider();
        // Force account selection every time
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        console.log('Firebase initialized successfully');
    } else {
        console.error('Firebase SDK not loaded');
    }
}

/**
 * Sign in with Google
 * @returns {Promise<Object>} Result with success status and user data
 */
async function signInWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;

        // Check if email is allowed
        if (user.email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
            // Sign out the unauthorized user
            await auth.signOut();
            return {
                success: false,
                error: "You don't have access. Please contact admin to create your account."
            };
        }

        return {
            success: true,
            user: {
                email: user.email,
                name: user.displayName || 'User',
                role: 'Super Admin',
                type: 'enterprise',
                photoURL: user.photoURL
            }
        };
    } catch (error) {
        console.error('Google sign-in error:', error);

        if (error.code === 'auth/popup-closed-by-user') {
            return {
                success: false,
                error: 'Sign-in cancelled. Please try again.'
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to sign in with Google. Please try again.'
        };
    }
}

/**
 * Send password reset email
 * @param {string} email - Email address to send reset link
 * @returns {Promise<Object>} Result with success status
 */
async function sendPasswordReset(email) {
    try {
        // Check if email is allowed
        if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
            return {
                success: false,
                error: "You don't have access. Please contact admin to create your account."
            };
        }

        await auth.sendPasswordResetEmail(email);

        return {
            success: true,
            message: 'Password reset link sent to your email. Please check your inbox.'
        };
    } catch (error) {
        console.error('Password reset error:', error);

        if (error.code === 'auth/user-not-found') {
            return {
                success: false,
                error: "You don't have access. Please contact admin to create your account."
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to send reset email. Please try again.'
        };
    }
}

/**
 * Sign out user
 */
async function firebaseSignOut() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current Firebase user
 */
function getCurrentUser() {
    return auth ? auth.currentUser : null;
}

/**
 * Check if email is allowed
 */
function isEmailAllowed(email) {
    return email.toLowerCase() === ALLOWED_EMAIL.toLowerCase();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFirebase);

// Export functions
window.NexusFirebase = {
    signInWithGoogle,
    sendPasswordReset,
    firebaseSignOut,
    getCurrentUser,
    isEmailAllowed,
    ALLOWED_EMAIL
};
