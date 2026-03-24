import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, OrgPermissions } from "../../types/store";

const useGetPermissions = (): OrgPermissions[] => {
  const permission = useSelector<RootState, OrgPermissions[]>(
    ({
      org: {
        general: { permissions }
      }
    }) => permissions
  );
  const [permissions, setPermissions] = useState<OrgPermissions[]>([]);

  useEffect(() => {
    setPermissions(permission);
  }, [permission]);

  return permissions;
};

export default useGetPermissions;
