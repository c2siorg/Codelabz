export const PERMISSION_LEVELS = {
  VIEWER: 0,
  EDITOR: 1,
  ADMIN: 2,
  OWNER: 3,
};

const ROLE_NAMES = {
  [PERMISSION_LEVELS.VIEWER]: "viewer",
  [PERMISSION_LEVELS.EDITOR]: "editor",
  [PERMISSION_LEVELS.ADMIN]: "admin",
  [PERMISSION_LEVELS.OWNER]: "owner",
};

/**
 * A membership carries exactly one role, held at index 0. Security rules read
 * `permissions[0]` and nothing else, so every client-side check has to read it
 * the same way -- taking the maximum here instead would grant UI that the
 * server then refuses, or hide UI the server would have allowed.
 */
export const getPermissionLevel = (permissions) => {
  if (!Array.isArray(permissions) || permissions.length === 0) return -1;
  const level = permissions[0];
  return typeof level === "number" ? level : -1;
};

export const getRoleName = (permissions) =>
  ROLE_NAMES[getPermissionLevel(permissions)] ?? "none";

export const hasPermission = (permissions, minLevel) =>
  getPermissionLevel(permissions) >= minLevel;
