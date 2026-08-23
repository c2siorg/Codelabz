import React from "react";
import { useSelector } from "react-redux";
import { hasPermission } from "./rbac";


const RequiresRole = ({ minLevel, children, fallback = null }) => {
  const permissions = useSelector(
    ({ org: { general: { permissions } } }) => permissions ?? []
  );
  return hasPermission(permissions, minLevel) ? children : fallback;
};

export default RequiresRole;
