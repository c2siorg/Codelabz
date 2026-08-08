import { useState, useEffect } from "react";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { RootState, FirebaseAuth } from "../../types/store";

const useAuthStatus = (): boolean => {
  const auth = useSelector<RootState, FirebaseAuth>(
    ({ firebase }) => firebase.auth
  );
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    setAuthed(isLoaded(auth) && !isEmpty(auth));
  }, [auth]);

  return authed;
};

export default useAuthStatus;
