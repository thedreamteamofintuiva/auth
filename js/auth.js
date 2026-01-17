/**
 * NEXUS AI - Authentication Module
 * Handles login, logout, session management, and authentication flows
 * DEMO ONLY - Never store passwords in localStorage in production
 */

// Demo user credentials
const DEMO_USERS = [
    // Enterprise Users
    { email: "superadmin@intuvia.com", password: "Admin@123", role: "Super Admin", type: "enterprise", name: "John Smith" },
    { email: "admin@intuvia.com", password: "Admin@123", role: "Admin", type: "enterprise", name: "Sarah Johnson" },
    { email: "viewer@intuvia.com", password: "Viewer@123", role: "Viewer", type: "enterprise", name: "Mike Wilson" },
    // Normal Users
    { email: "user@example.com", password: "User@123", role: "Attendee", type: "normal", name: "Emily Davis" },
    { email: "organizer@example.com", password: "Organizer@123", role: "Organizer", type: "normal", name: "Alex Brown" }
];

// Session storage key
const SESSION_KEY = 'nexus_ai_session';
const USERS_KEY = 'nexus_ai_users';

/**
 * Initialize the authentication system
 * Loads demo users into localStorage if not present
 */
function initAuth() {
    // Load demo users into localStorage if not already there
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
    }
}

/**
 * Get all users from localStorage
 * @returns {Array} Array of user objects
 */
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : DEMO_USERS;
}

/**
 * Save users to localStorage
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Validate login credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Result object with success status, user data, or error message
 */
function validateLogin(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return {
            success: false,
            error: 'No account found with this email address.'
        };
    }

    if (user.password !== password) {
        return {
            success: false,
            error: 'Invalid email or password. Please try again.'
        };
    }

    return {
        success: true,
        user: {
            email: user.email,
            role: user.role,
            type: user.type,
            name: user.name
        }
    };
}

/**
 * Create a user session
 * @param {Object} user - User data to store in session
 */
function createSession(user) {
    const session = {
        ...user,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Get current user session
 * @returns {Object|null} Session data or null if not logged in
 */
function getSession() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;

    const sessionData = JSON.parse(session);

    // Check if session has expired
    if (new Date(sessionData.expiresAt) < new Date()) {
        logout();
        return null;
    }

    return sessionData;
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user has a valid session
 */
function isLoggedIn() {
    return getSession() !== null;
}

/**
 * Get current user's role
 * @returns {string|null} User role or null if not logged in
 */
function getUserRole() {
    const session = getSession();
    return session ? session.role : null;
}

/**
 * Get current user's type (enterprise/normal)
 * @returns {string|null} User type or null if not logged in
 */
function getUserType() {
    const session = getSession();
    return session ? session.type : null;
}

/**
 * Logout user and clear session
 */
function logout() {
    localStorage.removeItem(SESSION_KEY);
}

/**
 * Handle forgot password request
 * @param {string} email - User email
 * @returns {Object} Result object with success status and message
 */
function handleForgotPassword(email) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return {
            success: false,
            error: 'No account found with this email address.'
        };
    }

    // In a real application, this would send an email
    // For demo, we create a reset token
    const resetToken = generateResetToken();

    // Store the reset token (in production, this would be server-side)
    const resetData = {
        email: user.email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    };
    localStorage.setItem('nexus_reset_token', JSON.stringify(resetData));

    return {
        success: true,
        message: 'Password reset link sent to your email.',
        // For demo purposes, include the token
        resetUrl: `reset-password.html?token=${resetToken}`
    };
}

/**
 * Generate a random reset token
 * @returns {string} Random token string
 */
function generateResetToken() {
    return 'reset_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Validate reset token
 * @param {string} token - Reset token to validate
 * @returns {Object} Result object with success status and email if valid
 */
function validateResetToken(token) {
    const resetData = localStorage.getItem('nexus_reset_token');

    if (!resetData) {
        return {
            success: false,
            error: 'Invalid or expired reset link.'
        };
    }

    const { email, token: storedToken, expiresAt } = JSON.parse(resetData);

    if (token !== storedToken) {
        return {
            success: false,
            error: 'Invalid reset link.'
        };
    }

    if (new Date(expiresAt) < new Date()) {
        localStorage.removeItem('nexus_reset_token');
        return {
            success: false,
            error: 'Reset link has expired. Please request a new one.'
        };
    }

    return {
        success: true,
        email: email
    };
}

/**
 * Reset user password
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Object} Result object with success status
 */
function resetPassword(token, newPassword) {
    const validation = validateResetToken(token);

    if (!validation.success) {
        return validation;
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === validation.email.toLowerCase());

    if (userIndex === -1) {
        return {
            success: false,
            error: 'User not found.'
        };
    }

    // Update password
    users[userIndex].password = newPassword;
    saveUsers(users);

    // Clear reset token
    localStorage.removeItem('nexus_reset_token');

    return {
        success: true,
        message: 'Password changed successfully. Redirecting to login...'
    };
}

/**
 * Simulate SSO login
 * @param {string} domain - Company domain
 * @returns {Object} Result object with success status and user data
 */
function loginWithSSO(domain) {
    // Simulate SSO authentication delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check if domain matches any enterprise user
            const users = getUsers();
            const enterpriseUsers = users.filter(u =>
                u.type === 'enterprise' &&
                u.email.endsWith('@' + domain)
            );

            if (enterpriseUsers.length === 0) {
                resolve({
                    success: false,
                    error: 'No enterprise users found for this domain.'
                });
                return;
            }

            // For demo, use the first enterprise user (Super Admin)
            const user = enterpriseUsers[0];
            resolve({
                success: true,
                user: {
                    email: user.email,
                    role: user.role,
                    type: user.type,
                    name: user.name
                }
            });
        }, 1500); // Simulate network delay
    });
}

/**
 * Simulate Google OAuth login
 * @param {string} selectedEmail - Selected Google account email (optional)
 * @returns {Object} Result object with success status and user data
 */
function loginWithGoogle(selectedEmail = null) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // For demo, simulate Google login with a normal user
            const users = getUsers();
            let user;

            if (selectedEmail) {
                user = users.find(u => u.email === selectedEmail);
            } else {
                // Default to first normal user
                user = users.find(u => u.type === 'normal');
            }

            if (!user) {
                // Create a new user from Google
                user = {
                    email: selectedEmail || 'google.user@gmail.com',
                    role: 'Attendee',
                    type: 'normal',
                    name: 'Google User'
                };
            }

            resolve({
                success: true,
                user: {
                    email: user.email,
                    role: user.role,
                    type: user.type,
                    name: user.name
                }
            });
        }, 1500);
    });
}

/**
 * Get dashboard URL based on user role
 * @param {string} role - User role
 * @returns {string} Dashboard URL
 */
function getDashboardUrl(role) {
    const dashboards = {
        'Super Admin': 'dashboard-superadmin.html',
        'Admin': 'dashboard-admin.html',
        'Viewer': 'dashboard-viewer.html',
        'Attendee': 'dashboard-user.html',
        'Organizer': 'dashboard-user.html'
    };
    return dashboards[role] || 'dashboard-user.html';
}

/**
 * Redirect to appropriate dashboard based on user role
 */
function redirectToDashboard() {
    const session = getSession();
    if (session) {
        window.location.href = getDashboardUrl(session.role);
    }
}

/**
 * Protect dashboard pages - redirect to login if not authenticated
 * @param {Array} allowedRoles - Array of roles allowed to access this page
 */
function protectRoute(allowedRoles = []) {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
        return false;
    }

    const userRole = getUserRole();
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // User doesn't have permission for this page
        return false;
    }

    return true;
}

/**
 * Get user initials for avatar
 * @param {string} name - User name
 * @returns {string} Initials (max 2 characters)
 */
function getUserInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', initAuth);

// Export functions for use in other modules
window.NexusAuth = {
    validateLogin,
    createSession,
    getSession,
    isLoggedIn,
    getUserRole,
    getUserType,
    logout,
    handleForgotPassword,
    validateResetToken,
    resetPassword,
    loginWithSSO,
    loginWithGoogle,
    getDashboardUrl,
    redirectToDashboard,
    protectRoute,
    getUserInitials
};
