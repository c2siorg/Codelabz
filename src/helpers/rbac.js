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

export const ROLE_OPTIONS = [
  { label: "Viewer", value: PERMISSION_LEVELS.VIEWER },
  { label: "Editor", value: PERMISSION_LEVELS.EDITOR },
  { label: "Admin", value: PERMISSION_LEVELS.ADMIN },
  { label: "Owner", value: PERMISSION_LEVELS.OWNER },
];

/**
 * Mirrors canAssignRole() in firestore.rules: admins may only hand out roles
 * below their own, owners may also grant ownership so that an org can hand it
 * over. Kept in one place so the picker and the rules cannot drift apart.
 */
export const getAssignableRoles = (actorLevel) =>
  ROLE_OPTIONS.filter(
    (option) =>
      option.value < actorLevel || actorLevel === PERMISSION_LEVELS.OWNER
  );

/**
 * Mirrors canActOnTarget() in firestore.rules: you may never edit or remove a
 * member at or above your own level.
 */
export const canManageMember = (actorLevel, targetLevel) =>
  actorLevel >= PERMISSION_LEVELS.ADMIN && targetLevel < actorLevel;
