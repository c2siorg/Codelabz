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

export const getMaxPermission = (permissions) => {
  if (!permissions || permissions.length === 0) return -1;
  return Math.max(...permissions);
};

export const getRoleName = (permissions) => {
  const max = getMaxPermission(permissions);
  return ROLE_NAMES[max] ?? "none";
};

export const hasPermission = (permissions, minLevel) => {
  if (!permissions || permissions.length === 0) return false;
  return permissions.some((p) => p >= minLevel);
};