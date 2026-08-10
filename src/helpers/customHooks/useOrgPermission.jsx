import { useSelector } from "react-redux";
import { getPermissionLevel, getRoleName } from "../rbac";

const useOrgPermission = () => {
  const permissions = useSelector(
    ({ org: { general: { permissions } } }) => permissions ?? []
  );

  return {
    permissions,
    level: getPermissionLevel(permissions),
    roleName: getRoleName(permissions),
  };
};

export default useOrgPermission;
