/**
 * NEXUS AI - Dashboard Module
 * Handles dashboard interactions, navigation, and UI components
 */

/**
 * Initialize dashboard
 * Checks authentication and sets up UI
 */
function initDashboard() {
    // Check if user is authenticated
    if (!window.NexusAuth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    // Get current session
    const session = window.NexusAuth.getSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    // Update user info in sidebar
    updateUserInfo(session);

    // Initialize components
    initSidebar();
    initUserDropdown();
    initMobileMenu();
    initNavigation();
}

/**
 * Update user information in the UI
 * @param {Object} session - User session data
 */
function updateUserInfo(session) {
    // Update sidebar user info
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');

    if (userAvatar && session.name) {
        userAvatar.textContent = window.NexusAuth.getUserInitials(session.name);
    }

    if (userName && session.name) {
        userName.textContent = session.name;
    }

    if (userRole && session.role) {
        userRole.textContent = session.role;
    }

    // Update header user info if present
    const headerAvatar = document.querySelector('.header-user-avatar');
    if (headerAvatar && session.name) {
        headerAvatar.textContent = window.NexusAuth.getUserInitials(session.name);
    }
}

/**
 * Initialize sidebar functionality
 */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!sidebar) return;

    // Close sidebar when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeSidebar();
        });
    }

    // Handle escape key to close sidebar on mobile
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });
}

/**
 * Open mobile sidebar
 */
function openSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.add('open');
    }
    if (overlay) {
        overlay.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
}

/**
 * Close mobile sidebar
 */
function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar) {
        sidebar.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('open');
    }
    document.body.style.overflow = '';
}

/**
 * Initialize user dropdown menu
 */
function initUserDropdown() {
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = document.querySelector('.user-dropdown-menu');

    if (!userMenu || !dropdownMenu) return;

    // Toggle dropdown
    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !userMenu.contains(e.target)) {
            dropdownMenu.classList.remove('open');
        }
    });

    // Handle dropdown items
    const logoutBtn = dropdownMenu.querySelector('[data-action="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.NexusAuth.logout();
            window.location.href = 'index.html';
        });
    }

    const profileBtn = dropdownMenu.querySelector('[data-action="profile"]');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            // For demo, just close dropdown
            dropdownMenu.classList.remove('open');
            alert('Profile settings would open here');
        });
    }
}

/**
 * Initialize mobile menu button
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            openSidebar();
        });
    }
}

/**
 * Initialize navigation items
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item:not(.disabled)');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Close mobile sidebar
            closeSidebar();
        });
    });
}

/**
 * Check if user has access to a feature
 * @param {string} feature - Feature name
 * @returns {boolean} Whether user has access
 */
function hasAccess(feature) {
    const role = window.NexusAuth.getUserRole();

    const permissions = {
        'Super Admin': ['events', 'admins', 'budget', 'sales', 'logs', 'settings', 'create-event', 'edit-event', 'delete-event'],
        'Admin': ['events', 'logs', 'create-event', 'edit-event'],
        'Viewer': ['events', 'logs'],
        'Organizer': ['events', 'create-event', 'edit-event'],
        'Attendee': ['events']
    };

    const rolePermissions = permissions[role] || [];
    return rolePermissions.includes(feature);
}

/**
 * Disable navigation items based on user role
 * @param {Array} disabledFeatures - Array of feature IDs to disable
 */
function disableNavItems(disabledFeatures) {
    disabledFeatures.forEach(feature => {
        const navItem = document.querySelector(`[data-feature="${feature}"]`);
        if (navItem) {
            navItem.classList.add('disabled');
        }
    });
}

/**
 * Show access denied message
 * @param {HTMLElement} container - Container element
 * @param {string} feature - Feature name
 */
function showAccessDenied(container, feature) {
    container.innerHTML = `
        <div class="access-denied">
            <div class="access-denied-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <h3 class="access-denied-title">Access Denied</h3>
            <p class="access-denied-text">You don't have permission to access ${feature}.</p>
            <button class="btn btn-secondary" onclick="history.back()">Go Back</button>
        </div>
    `;
}

/**
 * Format date for display
 * @param {string} dateStr - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Format time for display
 * @param {string} timeStr - Time string
 * @returns {string} Formatted time
 */
function formatTime(timeStr) {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Create event card HTML
 * @param {Object} event - Event data
 * @returns {string} HTML string
 */
function createEventCard(event) {
    const canEdit = hasAccess('edit-event');
    const canDelete = hasAccess('delete-event');

    return `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-image">
                <div class="event-image-placeholder">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" stroke-width="2"/>
                        <path d="M8 20H40M16 12V8M32 12V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <span class="event-status badge badge-${event.status === 'active' ? 'success' : event.status === 'draft' ? 'warning' : 'primary'}">
                    ${event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.name}</h3>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <svg class="event-meta-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M2 6H14M5 1V3M11 1V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span>${formatDate(event.date)}</span>
                    </div>
                    <div class="event-meta-item">
                        <svg class="event-meta-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M13 14C13 11.2386 10.7614 9 8 9C5.23858 9 3 11.2386 3 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span>${event.location}</span>
                    </div>
                </div>
                <div class="event-actions">
                    ${canEdit ? `<button class="btn btn-secondary" onclick="editEvent(${event.id})">Manage Event</button>` : ''}
                    ${canEdit && event.status === 'draft' ? `<button class="btn btn-primary" onclick="publishEvent(${event.id})">Publish</button>` : ''}
                    ${!canEdit ? `<button class="btn btn-secondary" onclick="viewEvent(${event.id})">View Details</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Demo event data
 */
const demoEvents = [
    { id: 1, name: 'Tech Summit 2025', date: '2025-03-15T09:00:00', location: 'San Francisco, CA', status: 'active' },
    { id: 2, name: 'Marketing Conference', date: '2025-04-20T10:00:00', location: 'New York, NY', status: 'active' },
    { id: 3, name: 'Product Launch Event', date: '2025-05-10T14:00:00', location: 'Virtual', status: 'draft' },
    { id: 4, name: 'Annual Company Meetup', date: '2025-06-01T09:00:00', location: 'Austin, TX', status: 'upcoming' }
];

/**
 * Load events into the grid
 */
function loadEvents() {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = demoEvents.map(event => createEventCard(event)).join('');
}

/**
 * Handle edit event (demo)
 * @param {number} eventId - Event ID
 */
function editEvent(eventId) {
    alert(`Edit event ${eventId} - This would open the event editor`);
}

/**
 * Handle view event (demo)
 * @param {number} eventId - Event ID
 */
function viewEvent(eventId) {
    alert(`View event ${eventId} - This would show event details`);
}

/**
 * Handle publish event (demo)
 * @param {number} eventId - Event ID
 */
function publishEvent(eventId) {
    if (confirm('Are you sure you want to publish this event?')) {
        alert(`Event ${eventId} published!`);
        loadEvents();
    }
}

/**
 * Handle create event (demo)
 */
function createEvent() {
    if (!hasAccess('create-event')) {
        alert('You do not have permission to create events.');
        return;
    }
    alert('Create event - This would open the event creation wizard');
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    loadEvents();
});

// Export dashboard functions
window.NexusDashboard = {
    initDashboard,
    updateUserInfo,
    openSidebar,
    closeSidebar,
    hasAccess,
    disableNavItems,
    showAccessDenied,
    formatDate,
    formatTime,
    loadEvents,
    createEvent,
    editEvent,
    viewEvent,
    publishEvent
};
