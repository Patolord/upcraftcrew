export { api } from "./convex/_generated/api";

// Export permissions system
export {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasRoleLevel,
  canAccessResource,
  type Role,
  type Permission,
} from "./convex/permissions";
