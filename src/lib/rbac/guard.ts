import { rolePermissions, type Permission } from "./policies";

type Context = {
  // For ownership checks
  resourceOwnerId?: string;
  // Current user id (from session)
  userId?: string;
  // Optional extra flags
  isCreator?: boolean;
};

export function can(
  role: "ADMIN" | "USER",
  permission: Permission,
  ctx?: Context
): boolean {
  // Role-based permission
  const allowed = rolePermissions[role]?.includes(permission) ?? false;
  if (!allowed) return false;

  // Optional attribute-based constraint for USER
  if (role === "USER" && ctx) {
    // Example: users can update only their own tickets
    if (permission === "ticket:update" || permission === "ticket:delete") {
      if (ctx.resourceOwnerId && ctx.userId) {
        return ctx.resourceOwnerId === ctx.userId;
      }
    }
  }

  return true;
}
