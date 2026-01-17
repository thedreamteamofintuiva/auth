/**
 * NEXUS AI - Form Validation Module
 * Handles real-time form validation and error display
 */

// Validation patterns
const PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: {
        minLength: 8,
        hasUppercase: /[A-Z]/,
        hasLowercase: /[a-z]/,
        hasNumber: /[0-9]/,
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
    }
};

// Error messages
const MESSAGES = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    passwordWeak: 'Password must meet all requirements',
    passwordMismatch: 'Passwords do not match'
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: MESSAGES.required };
    }
    if (!PATTERNS.email.test(email)) {
        return { valid: false, message: MESSAGES.email };
    }
    return { valid: true, message: '' };
}

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {Object} Validation result
 */
function validateRequired(value) {
    if (!value || value.trim() === '') {
        return { valid: false, message: MESSAGES.required };
    }
    return { valid: true, message: '' };
}

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} Strength analysis
 */
function checkPasswordStrength(password) {
    const requirements = {
        minLength: password.length >= PATTERNS.password.minLength,
        hasUppercase: PATTERNS.password.hasUppercase.test(password),
        hasLowercase: PATTERNS.password.hasLowercase.test(password),
        hasNumber: PATTERNS.password.hasNumber.test(password),
        hasSpecial: PATTERNS.password.hasSpecial.test(password)
    };

    const metCount = Object.values(requirements).filter(Boolean).length;

    let strength;
    if (metCount <= 2) {
        strength = 'weak';
    } else if (metCount <= 4) {
        strength = 'medium';
    } else {
        strength = 'strong';
    }

    return {
        requirements,
        strength,
        allMet: metCount === 5,
        score: metCount
    };
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {boolean} checkStrength - Whether to check password strength requirements
 * @returns {Object} Validation result
 */
function validatePassword(password, checkStrength = false) {
    if (!password || password.trim() === '') {
        return { valid: false, message: MESSAGES.required };
    }

    if (checkStrength) {
        const strength = checkPasswordStrength(password);
        if (!strength.allMet) {
            return { valid: false, message: MESSAGES.passwordWeak, strength };
        }
        return { valid: true, message: '', strength };
    }

    return { valid: true, message: '' };
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} Validation result
 */
function validatePasswordMatch(password, confirmPassword) {
    if (!confirmPassword || confirmPassword.trim() === '') {
        return { valid: false, message: MESSAGES.required };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: MESSAGES.passwordMismatch };
    }
    return { valid: true, message: '' };
}

/**
 * Show field error
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 * @param {string} message - Error message
 */
function showFieldError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Show field success
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function showFieldSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Clear field state
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function clearFieldState(input, errorElement) {
    input.classList.remove('error', 'success');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Show global error message
 * @param {HTMLElement} container - Error container element
 * @param {HTMLElement} textElement - Text element inside container
 * @param {string} message - Error message
 */
function showError(container, textElement, message) {
    container.classList.remove('hidden');
    textElement.textContent = message;
}

/**
 * Show global success message
 * @param {HTMLElement} container - Success container element
 * @param {HTMLElement} textElement - Text element inside container
 * @param {string} message - Success message
 */
function showSuccess(container, textElement, message) {
    container.classList.remove('hidden');
    textElement.textContent = message;
}

/**
 * Hide message container
 * @param {HTMLElement} container - Container element
 */
function hideMessage(container) {
    container.classList.add('hidden');
}

/**
 * Update password strength indicator
 * @param {HTMLElement} fillElement - Strength bar fill element
 * @param {HTMLElement} textElement - Strength text element
 * @param {string} strength - Strength level (weak/medium/strong)
 */
function updateStrengthIndicator(fillElement, textElement, strength) {
    // Remove all strength classes
    fillElement.classList.remove('weak', 'medium', 'strong');
    textElement.classList.remove('weak', 'medium', 'strong');

    // Add appropriate class
    fillElement.classList.add(strength);
    textElement.classList.add(strength);

    // Update text
    const labels = {
        weak: 'Weak password',
        medium: 'Medium strength',
        strong: 'Strong password'
    };
    textElement.textContent = labels[strength];
}

/**
 * Update password requirements list
 * @param {HTMLElement} listElement - Requirements list element
 * @param {Object} requirements - Requirements status object
 */
function updateRequirementsList(listElement, requirements) {
    const items = listElement.querySelectorAll('li');
    const reqKeys = ['minLength', 'hasUppercase', 'hasLowercase', 'hasNumber', 'hasSpecial'];

    items.forEach((item, index) => {
        if (reqKeys[index] && requirements[reqKeys[index]]) {
            item.classList.add('valid');
        } else {
            item.classList.remove('valid');
        }
    });
}

/**
 * Set button loading state
 * @param {HTMLElement} button - Button element
 * @param {boolean} loading - Loading state
 */
function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

/**
 * Initialize login form validation
 */
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const passwordToggle = document.getElementById('passwordToggle');
    const signInBtn = document.getElementById('signInBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const ssoLoginBtn = document.getElementById('ssoLoginBtn');
    const demoToggle = document.getElementById('demoToggle');
    const demoCredentials = document.getElementById('demoCredentials');

    // Check if already logged in
    if (window.NexusAuth && window.NexusAuth.isLoggedIn()) {
        window.NexusAuth.redirectToDashboard();
        return;
    }

    // Password visibility toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;

            const eyeIcon = passwordToggle.querySelector('.eye-icon');
            const eyeOffIcon = passwordToggle.querySelector('.eye-off-icon');

            if (type === 'text') {
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        });
    }

    // Demo credentials toggle
    if (demoToggle) {
        demoToggle.addEventListener('click', () => {
            demoCredentials.classList.toggle('hidden');
        });
    }

    // Real-time email validation
    emailInput.addEventListener('blur', () => {
        const result = validateEmail(emailInput.value);
        if (!result.valid) {
            showFieldError(emailInput, emailError, result.message);
        } else {
            showFieldSuccess(emailInput, emailError);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            const result = validateEmail(emailInput.value);
            if (result.valid) {
                showFieldSuccess(emailInput, emailError);
            }
        }
        hideMessage(errorMessage);
    });

    // Real-time password validation
    passwordInput.addEventListener('blur', () => {
        const result = validateRequired(passwordInput.value);
        if (!result.valid) {
            showFieldError(passwordInput, passwordError, result.message);
        } else {
            showFieldSuccess(passwordInput, passwordError);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('error')) {
            const result = validateRequired(passwordInput.value);
            if (result.valid) {
                showFieldSuccess(passwordInput, passwordError);
            }
        }
        hideMessage(errorMessage);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const emailResult = validateEmail(emailInput.value);
        const passwordResult = validateRequired(passwordInput.value);

        if (!emailResult.valid) {
            showFieldError(emailInput, emailError, emailResult.message);
        }
        if (!passwordResult.valid) {
            showFieldError(passwordInput, passwordError, passwordResult.message);
        }

        if (!emailResult.valid || !passwordResult.valid) {
            return;
        }

        // Show loading state
        setButtonLoading(signInBtn, true);
        hideMessage(errorMessage);
        hideMessage(successMessage);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validate credentials
        const result = window.NexusAuth.validateLogin(emailInput.value, passwordInput.value);

        if (!result.success) {
            setButtonLoading(signInBtn, false);
            showError(errorMessage, errorText, result.error);
            return;
        }

        // Create session and redirect
        window.NexusAuth.createSession(result.user);
        showSuccess(successMessage, successText, 'Success! Redirecting...');

        setTimeout(() => {
            window.NexusAuth.redirectToDashboard();
        }, 500);
    });

    // Google login
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            window.location.href = 'google-auth.html';
        });
    }

    // SSO login
    if (ssoLoginBtn) {
        ssoLoginBtn.addEventListener('click', () => {
            window.location.href = 'sso-login.html';
        });
    }
}

/**
 * Initialize forgot password form
 */
function initForgotPasswordForm() {
    const form = document.getElementById('forgotPasswordForm');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    // Email validation
    emailInput.addEventListener('blur', () => {
        const result = validateEmail(emailInput.value);
        if (!result.valid) {
            showFieldError(emailInput, emailError, result.message);
        } else {
            showFieldSuccess(emailInput, emailError);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            const result = validateEmail(emailInput.value);
            if (result.valid) {
                showFieldSuccess(emailInput, emailError);
            }
        }
        hideMessage(errorMessage);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailResult = validateEmail(emailInput.value);
        if (!emailResult.valid) {
            showFieldError(emailInput, emailError, emailResult.message);
            return;
        }

        setButtonLoading(submitBtn, true);
        hideMessage(errorMessage);
        hideMessage(successMessage);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = window.NexusAuth.handleForgotPassword(emailInput.value);

        if (!result.success) {
            setButtonLoading(submitBtn, false);
            showError(errorMessage, errorText, result.error);
            return;
        }

        setButtonLoading(submitBtn, false);
        showSuccess(successMessage, successText, result.message);

        // For demo, show the reset link
        console.log('Demo reset URL:', result.resetUrl);

        // Optionally redirect to reset page for demo
        setTimeout(() => {
            window.location.href = result.resetUrl;
        }, 2000);
    });
}

/**
 * Initialize reset password form
 */
function initResetPasswordForm() {
    const form = document.getElementById('resetPasswordForm');
    if (!form) return;

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const passwordInput = document.getElementById('newPassword');
    const confirmInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    const requirementsList = document.querySelector('.requirements-list');
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmToggle = document.getElementById('confirmToggle');

    // Validate token on load
    if (!token) {
        showError(errorMessage, errorText, 'Invalid reset link. Please request a new one.');
        form.querySelector('fieldset').disabled = true;
        return;
    }

    const tokenResult = window.NexusAuth.validateResetToken(token);
    if (!tokenResult.success) {
        showError(errorMessage, errorText, tokenResult.error);
        form.querySelector('fieldset').disabled = true;
        return;
    }

    // Password visibility toggles
    [
        { toggle: passwordToggle, input: passwordInput },
        { toggle: confirmToggle, input: confirmInput }
    ].forEach(({ toggle, input }) => {
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;

                const eyeIcon = toggle.querySelector('.eye-icon');
                const eyeOffIcon = toggle.querySelector('.eye-off-icon');

                if (type === 'text') {
                    eyeIcon.classList.add('hidden');
                    eyeOffIcon.classList.remove('hidden');
                } else {
                    eyeIcon.classList.remove('hidden');
                    eyeOffIcon.classList.add('hidden');
                }
            });
        }
    });

    // Password strength checking
    passwordInput.addEventListener('input', () => {
        const strength = checkPasswordStrength(passwordInput.value);

        if (strengthFill && strengthText) {
            if (passwordInput.value.length > 0) {
                updateStrengthIndicator(strengthFill, strengthText, strength.strength);
            } else {
                strengthFill.classList.remove('weak', 'medium', 'strong');
                strengthText.textContent = '';
            }
        }

        if (requirementsList) {
            updateRequirementsList(requirementsList, strength.requirements);
        }

        if (passwordInput.classList.contains('error')) {
            if (strength.allMet) {
                showFieldSuccess(passwordInput, passwordError);
            }
        }

        hideMessage(errorMessage);
    });

    // Confirm password validation
    confirmInput.addEventListener('input', () => {
        if (confirmInput.classList.contains('error')) {
            const result = validatePasswordMatch(passwordInput.value, confirmInput.value);
            if (result.valid) {
                showFieldSuccess(confirmInput, confirmError);
            }
        }
        hideMessage(errorMessage);
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const passwordResult = validatePassword(passwordInput.value, true);
        const confirmResult = validatePasswordMatch(passwordInput.value, confirmInput.value);

        if (!passwordResult.valid) {
            showFieldError(passwordInput, passwordError, passwordResult.message);
        }
        if (!confirmResult.valid) {
            showFieldError(confirmInput, confirmError, confirmResult.message);
        }

        if (!passwordResult.valid || !confirmResult.valid) {
            return;
        }

        setButtonLoading(submitBtn, true);
        hideMessage(errorMessage);
        hideMessage(successMessage);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const result = window.NexusAuth.resetPassword(token, passwordInput.value);

        if (!result.success) {
            setButtonLoading(submitBtn, false);
            showError(errorMessage, errorText, result.error);
            return;
        }

        setButtonLoading(submitBtn, false);
        showSuccess(successMessage, successText, result.message);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
}

// Initialize forms on page load
document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initForgotPasswordForm();
    initResetPasswordForm();
});

// Export validation functions
window.NexusValidation = {
    validateEmail,
    validateRequired,
    validatePassword,
    validatePasswordMatch,
    checkPasswordStrength,
    showFieldError,
    showFieldSuccess,
    clearFieldState,
    showError,
    showSuccess,
    hideMessage,
    setButtonLoading
};
