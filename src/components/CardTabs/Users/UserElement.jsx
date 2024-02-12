import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AddUser from "../../../assets/images/add-user.svg";
import CheckUser from "../../../assets/images/square-check-regular.svg";
import { addUserFollower } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { isUserFollower, removeUserFollower } from "../../../store/actions/profileActions";



const UserElement = ({ user, index, useStyles }) => {
  const classes = useStyles();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [icon, setIcon] = useState(true);
  

  const currentProfileData = useSelector(
    ({ firebase: { profile } }) => profile
  );
  const addFollower = async e => {
    e.preventDefault();
    
    
    await addUserFollower(currentProfileData, user, firestore, dispatch);
    
  };

  const removeFollower=async e=>{
    e.preventDefault();
    
    await removeUserFollower(currentProfileData, user, firestore, dispatch);
  }
  const handleClick=(e)=>{
    e.preventDefault();
    
    async function followAction(){
      const flag=await(isUserFollower(currentProfileData.uid,user.uid,firestore));
        if(!flag){
          addFollower(e);
          setIcon(false);
        }
        else{
          removeFollower(e);
          setIcon(true);
        }
    }
    if(user.displayName)
    followAction()
    
  } 

  useEffect(()=>{

    async function fetchdata(){

      const flag=await(isUserFollower(currentProfileData.uid,user.uid,firestore));
    console.log(flag);
      if(flag)
      {
        setIcon(false);
      }
    }
    if(user.displayName)
    fetchdata()

    
  },[user,currentProfileData]);
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        key: "user" + { index },
        mb: 1.5
      }}
      gutterBottom
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <img
          src={user.img[0]}
          className={classes.userImg}
          data-testId={index == 0 ? "UsersCardImg" : ""}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{ fontWeight: 600, fontSize: "1rem" }}
            data-testId={index == 0 ? "UserName" : ""}
          >
            {user.displayName?user.displayName:user.name}
          </Box>
          <Box
            sx={{ fontWeight: 400, fontSize: "0.8rem" }}
            data-testId={index == 0 ? "UserDesg" : ""}
          >
            {`Software Engineer`}
          </Box>
        </Box>
      </Box>
      <Box
        onClick={handleClick}
        data-testId={index == 0 ? "UserAdd" : ""}
        sx={
          icon && {
            cursor: "pointer"
          }
        }
      >
        <img src={icon ? AddUser : CheckUser} />
      </Box>
    </Box>
  );
};

export default UserElement;
