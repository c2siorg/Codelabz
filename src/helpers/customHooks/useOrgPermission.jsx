import { useSelector } from "react-redux";
import { getMaxPermission, getRoleName } from "../rbac";

const useOrgPermission = () => {
  const permissions = useSelector(
    ({ org: { general: { permissions } } }) => permissions ?? []
  );

  return {
    permissions,
    level: getMaxPermission(permissions),
    roleName: getRoleName(permissions),
  };
};

export default useOrgPermission;
