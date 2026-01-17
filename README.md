# NEXUS AI - Login System Demo

A complete, interactive login system demonstration for the NEXUS AI event management platform. This static demo showcases enterprise SSO and normal user authentication flows.

## Live Demo

[View on Vercel](https://your-url.vercel.app)

## Demo Credentials

### Enterprise Users (SSO)

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | superadmin@intuvia.com | Admin@123 |
| **Admin** | admin@intuvia.com | Admin@123 |
| **Viewer** | viewer@intuvia.com | Viewer@123 |

### Normal Users

| Role | Email | Password |
|------|-------|----------|
| **Attendee** | user@example.com | User@123 |
| **Organizer** | organizer@example.com | Organizer@123 |

## Features

- Multi-role authentication system
  - Super Admin: Full platform access
  - Admin: Limited management capabilities
  - Viewer: Read-only access
  - Attendee/Organizer: Standard user access
- SSO login simulation
- Google OAuth simulation
- Forgot password flow with password change
- Real-time form validation
- Password strength indicator
- Role-based dashboards
- Responsive design (mobile, tablet, desktop)
- Session management with localStorage

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Main login page with email/password, Google, and SSO options |
| `forgot-password.html` | Password reset request form |
| `reset-password.html` | New password creation with strength validation |
| `sso-login.html` | Enterprise SSO login simulation |
| `google-auth.html` | Google OAuth account selection simulation |
| `dashboard-superadmin.html` | Super Admin dashboard with full access |
| `dashboard-admin.html` | Admin dashboard with limited access |
| `dashboard-viewer.html` | Viewer dashboard (read-only) |
| `dashboard-user.html` | Normal user dashboard |

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom design system with CSS variables
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **LocalStorage** - Session management (demo only)

## Design System

- **Primary Color:** Purple (#6366F1)
- **Aesthetic:** Linear/Vercel inspired, minimal shadows with borders
- **Font:** Inter (Google Fonts)
- **Border Radius:** 4px inputs, 8px buttons/cards
- **Spacing:** 8px base unit (8, 16, 24, 32, 48px)

## Project Structure

```
nexus-ai-login-demo/
├── index.html
├── forgot-password.html
├── reset-password.html
├── sso-login.html
├── google-auth.html
├── dashboard-superadmin.html
├── dashboard-admin.html
├── dashboard-viewer.html
├── dashboard-user.html
├── css/
│   ├── styles.css
│   ├── login.css
│   └── dashboard.css
├── js/
│   ├── auth.js
│   ├── validation.js
│   └── dashboard.js
├── assets/
│   └── icons/
├── README.md
├── vercel.json
└── .gitignore
```

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub
2. Import the repository in Vercel
3. Deploy with default settings

### GitHub Pages

1. Push this repository to GitHub
2. Go to Settings > Pages
3. Select the main branch as source
4. Your site will be available at `https://username.github.io/repo-name`

### Local Development

Simply open `index.html` in a browser. No build step required.

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Security Note

**This is a DEMONSTRATION ONLY.**

Never store passwords in localStorage in production applications. For production use:

- Implement proper backend authentication
- Use encrypted password storage (bcrypt, argon2)
- Use JWT tokens with secure HTTP-only cookies
- Implement CSRF protection
- Use HTTPS everywhere
- Add rate limiting
- Implement proper session management

## Authentication Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Login     │────►│  Validate    │────►│  Create     │
│   Form      │     │  Credentials │     │  Session    │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                    │
                           │                    ▼
                           │              ┌─────────────┐
                           │              │  Redirect   │
                           │              │  Dashboard  │
                           │              └─────────────┘
                           ▼
                    ┌──────────────┐
                    │  Show Error  │
                    │  Message     │
                    └──────────────┘
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This demo is provided for demonstration purposes. Feel free to use it as inspiration for your own projects.

---

Built with care for NEXUS AI - "The Canva + Netflix + WaterGraph of Events"
