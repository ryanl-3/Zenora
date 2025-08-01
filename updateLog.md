## [2025-07-31] 
- Connected Google OAuth with Database
- Researched RBAC( Role-Based Access Control

### Summary
- Integrated Google OAuth login using NextAuth and linked it to the local MongoDB user system through Prisma.
- Brainstormed a schema with RBAC to secure pages and features based on roles (ex: admin, owner, tenant).

### Changes Made
- Ensured every authenticated Google user now has a corresponding local database entry with a MongoDB `_id`.
