import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { RootState, UserProfile } from "../../types/store";

// Checks the user handle and sees if user is allowed to access dashboard
const useAllowDashboard = (): boolean => {
  const profile = useSelector<RootState, UserProfile>(
    ({ firebase: { profile } }) => profile
  );
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    setAllowed(Boolean(_.get(profile, "handle", false)));
  }, [profile]);

  return allowed;
};

export default useAllowDashboard;
