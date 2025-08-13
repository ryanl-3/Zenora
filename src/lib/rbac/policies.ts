//These are all the possible permissions
export type Permission =
  | "ticket:create"
  | "ticket:read"
  | "ticket:update"
  | "ticket:delete"
  | "ticket:assign"
  | "admin:dashboard";

//These give specific roles their permissions
export const rolePermissions: Record<"ADMIN" | "USER", Permission[]> = {
  ADMIN: [
    "ticket:create",
    "ticket:read",
    "ticket:update",
    "ticket:delete",
    "ticket:assign",
    "admin:dashboard",
  ],
  USER: [
    "ticket:create",
    "ticket:read", 
    "ticket:update"],
};
