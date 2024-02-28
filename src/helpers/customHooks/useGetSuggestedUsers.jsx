import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { useFirestore } from "react-redux-firebase";
import useAuthStatus from "./useAuthStatus";

const useGetSuggestedUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState();

  const dispatch = useDispatch();
  const authUser = useAuthStatus();
  const fireStore = useFirestore();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = fireStore.collection("cl_user");
        
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        querySnapshot.forEach(doc => {
          users.push({ ...doc.data(), id: doc.id });
        });

        setSuggestedUsers(users);
        console.log(users);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSuggestedUsers();
  }, [dispatch]);

  return { isLoading, suggestedUsers };
};

export default useGetSuggestedUsers;
