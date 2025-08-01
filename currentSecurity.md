# Security Measures
## Authentication
- **Hashed Passwords**  
  Passwords are hashed using `bcryptjs` before storing in MongoDB.

- **Manual Email/Password Login**  
  Custom `authorize()` function checks:
  - User exists
  - Password matches hashed value

- **Google OAuth Login**  
  - Uses secure third-party Google login
  - Links Google accounts to MongoDB by email
  - Creates a user entry if one doesn’t exist

## Session & Token Management
- **Stateless Sessions with JWT**  
  - Sessions are stored in signed, encrypted JWT cookies
  - No server-side session storage required

- **Secure JWT Signing**  
  - Tokens are signed with SECRET to prevent tampering

- **Custom Session Callback**  
  - Only exposes safe fields (`id`, `email`, `name`) to the frontend
  - Prevents sensitive data from leaking to client

## Input Validation
- **Form-Level Validation**
  - Requires email and password that meet minimum requirements
  - Rejects invalid or empty submissions before hitting backend

## Future Enhancements
- **RBAC (Role-Based Access Control)**  
  Restrict access to protected routes/pages based on user roles
- **Email Verification**  
- **Login History / Audit Logging**  
  Track logins and detect suspicious activity
- **Rate Limiting**  
  Prevent brute-force attacks on login and registration endpoints
