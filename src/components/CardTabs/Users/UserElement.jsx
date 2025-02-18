import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import AddUser from "../../../assets/images/add-user.svg";
import CheckUser from "../../../assets/images/square-check-regular.svg";
import { useFirestore } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {
  isUserFollower,
  addUserFollower,
  removeUserFollower
} from "../../../store/actions";

const UserElement = ({ user, index, useStyles }) => {
  const classes = useStyles();
  const firestore = useFirestore();
  const history = useHistory();

  const profileData = user;
  const currentProfileData = useSelector(
    ({ firebase: { profile } }) => profile
  );
  const followerId = currentProfileData.uid;
  const followingId = profileData.uid;
  const [followStatus, setFollowStatus] = useState('NOT_FOLLOWING');
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      if (followStatus === 'NOT_FOLLOWING') {
        await addUserFollower(currentProfileData, profileData, firestore);
        setFollowStatus('FOLLOWED');
      } else {
        await removeUserFollower(currentProfileData, profileData, firestore);
        setFollowStatus('NOT_FOLLOWING');
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = () => {
    history.push(`/user/${user.desg}`);
  };

  useEffect(() => {
    const checkIfFollowing = async () => {
      const isFollowing = await isUserFollower(
        followerId,
        followingId,
        firestore
      );
      setFollowStatus(isFollowing ? 'FOLLOWED' : 'NOT_FOLLOWING');
    };

    checkIfFollowing();
  }, [followerId, followingId, firestore]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1.5,
        cursor: "pointer",
        padding: "8px",
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '8px'
        }
      }}
      onClick={handleUserClick}
      data-testid={`user-element-${index}`}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <img
          src={user.img[0]}
          className={classes.userImg}
          data-testId={index === 0 ? "UsersCardImg" : ""}
          alt={user.name}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{ fontWeight: 600, fontSize: "1rem" }}
            data-testId={index === 0 ? "UserName" : ""}
          >
            {user.name}
          </Box>
          <Box
            sx={{ 
              fontWeight: 400, 
              fontSize: "0.8rem",
              color: 'text.secondary'
            }}
            data-testId={index === 0 ? "UserDesg" : ""}
          >
            {user.desg}
          </Box>
        </Box>
      </Box>

      <Box
        onClick={handleFollowToggle}
        data-testId={index === 0 ? "UserAdd" : ""}
        sx={{
          cursor: "pointer",
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)'
          }
        }}
      >
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <img
              src={followStatus === 'FOLLOWED' ? CheckUser : AddUser}
              alt={followStatus === 'FOLLOWED' ? "Following" : "Follow"}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ 
              fontSize: '0.8rem',
              color: followStatus === 'FOLLOWED' ? '#2e7d32' : 'inherit'
            }}>
              {followStatus === 'FOLLOWED' ? 'Following' : 'Follow'}
            </span>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default UserElement;