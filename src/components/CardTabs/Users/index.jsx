import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import UserElement from "./UserElement";
import { getUserFeedData, getUserFeedIdArray } from "../../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import OrgUser from "../../../assets/images/org-user.svg";
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    },
    flex: 1,
    marginBottom: "2rem"
  },
  userImg: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    marginRight: "10px"
  },

  card: {
    display: "flex",
    minWidth: "100%",
    width: "100%"
  },

  cardContent: {
    width: "100%"
  }
}));

const UserCard = ({ title, userId }) => {
  const classes = useStyles();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const [usersToFollow, setUsersToFollow] = useState([]);

  const users = useSelector(
    ({
      profile: {
        userFeed: { userFeedArray }
      }
    }) => userFeedArray
  );

  const [contributors, setContributors] = useState([
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    },
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    },
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    },
    {
      name: "Janvi Thakkar",
      img: [OrgUser],
      desg: "Software Engineer",
      onClick: {}
    }
  ]);

  useEffect(() => {
    const getUserFeed = async () => {
      const userIdArray = await getUserFeedIdArray(userId)(
        firebase,
        firestore,
        dispatch
      );
      getUserFeedData(userIdArray)(firebase, firestore, dispatch);
    };

    getUserFeed();
  }, []);

  useEffect(() => {
    const updatedUsersToFollow = users
      .filter(user => user.uid !== userId)
      .map(user => ({
        uid: user.uid,
        name: user.displayName,
        img: user.photoURL ? [user.photoURL] : [OrgUser],
        desg: user.handle,
        onClick: {}
      }));
    setUsersToFollow(updatedUsersToFollow);
  }, [users]);

  return (
    <div className={classes.root} data-testId="UsersCard">
      <Card sx={{ minWidth: 275 }} className={(classes.card, classes.root)}>
        <CardContent className={classes.cardContent}>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            data-testId="UsersCardTitle"
          >
            {title}
          </Typography>

          {title === "Who to Follow" &&
            usersToFollow.map(function (user, index) {
              return (
                <UserElement
                  key={index}
                  user={user}
                  index={index}
                  useStyles={useStyles}
                />
              );
            })}

          {title === "Contributors" &&
            contributors.map(function (user, index) {
              return (
                <UserElement
                  key={index}
                  user={user}
                  index={index}
                  useStyles={useStyles}
                />
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;
