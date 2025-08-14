## [2025-08-14] 
- Reorganized file structure: after login, users are directed to /dashboard, which routes to either /dashboard/admin or /dashboard/user.
- Each role folder contains its own tickets and create-ticket pages.
- Centralized ticket creation and reply forms in /src/features/tickets.
- Established /src/features as the main location for future features (e.g., messaging).

## [2025-08-11] 
- Added RBAC policies and guard in lib/ folder.
- Updated routing so admins and users have distinct dashboards.
- Modified nextauth.d.ts to include new role field in type definitions.

## [2025-08-05] 
- Implemented Forgot Password and Reset Password functionality, including frontend UI and backend API integration.
- Added manual Role-Based Access Control (RBAC) by enabling role assignment and access control through direct role updates in MongoDB.
  
## [2025-08-01] 
- Configured Amazon Simple Email Service (SES).
- Integrated SES into a Next.js application using the NextAuth authentication system.
- Implemented functionality to automatically send an email to users upon login via OAuth providers (e.g., Google).


## [2025-07-31] 
- Connected Google OAuth with Database
- Researched RBAC( Role-Based Access Control

### Summary
- Integrated Google OAuth login using NextAuth and linked it to the local MongoDB user system through Prisma.
- Brainstormed a schema with RBAC to secure pages and features based on roles (ex: admin, owner, tenant).
