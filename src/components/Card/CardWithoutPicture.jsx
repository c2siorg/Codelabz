import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import {FacebookShareButton, WhatsappShareButton, TwitterShareButton, LinkedinShareButton, TwitterIcon, WhatsappIcon, FacebookIcon, LinkedinIcon} from 'react-share';
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ToggleButton from "@mui/lab/ToggleButton";
import ToggleButtonGroup from "@mui/lab/ToggleButtonGroup";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { getUserProfileData } from "../../store/actions";
import { CancelOutlined, ReportProblemOutlined, TurnedIn } from "@mui/icons-material";
import { MenuItem, MenuList } from "@mui/material";
const useStyles = makeStyles(theme => ({
  button:{
    border:"0px",
    background:"white"
  },
  root: {
    margin: "0.5rem",
    borderRadius: "10px",
    position:"relative",
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
      width: "auto"
    },
    [theme.breakpoints.down("xs")]: {
      width: "auto"
    }
  },
  shareContainer:{
    width:"45%",
    height:"70%",
    bottom:"30%",
    right:"0px",
    background:"white",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius:"25px",
    position:"absolute",
    display:"flex",
    flexDirection:"column",
  },
  moreContainer:{
    bottom:"27%",
    right:"2%",
    background:"white",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius:"25px",
    position:"absolute",
    display:"flex",
    flexDirection:"column",
    padding:"10px"
  },
  cancelButton:{
    position:"relative",
    width:"10%",
    height:"10%",
    margin:"10px 0px 0px 88%",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    borderTopRightRadius:"25px",
  },
  socialIconsDiv:{
    position:"relative",
    marginTop:"2%",
    width:"100%",
    height:"50%",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
  },
  socialIcon:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    width:"40px",
    height:"40px",
    margin:"0 15px 0 15px",
    borderRadius:"50px",
    '&:hover': {
      width:"50px",
      height:"50px"
    }
  },
  shareLinkContainer:{
    width:"100%",
    display:"flex",
    height:"15%",
    position:"relative",
    justifyContent:"center",
    margin:"20px 0px 20px 0px"
  },
  shareLinkContainerInput:{
    width:"60%",
    height:"80%",
    marginRight:"1%",
    textAlign:"center",
    position:"relative",
  },
  shareLinkContainerCopyButton:{
    width:"20%",
    height:"100%",
    position:"relative",
    fontSize:"70%",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },

  grow: {
    flexGrow: 1
  },
  margin: {
    marginRight: "5px"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  inline: {
    fontWeight: 600
  },
  contentPadding: {
    padding: "0 16px"
  },
  icon: {
    padding: "5px"
  },
  time: {
    lineHeight: "1"
  },
  small: {
    padding: "4px"
  },
  settings: {
    flexWrap: "wrap"
  }
}));

export default function CardWithoutPicture({ tutorial }) {
  const classes = useStyles();
  const [alignment, setAlignment] = React.useState("left");
  const [count, setCount] = useState(1);
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const path = useHistory();
  const firestore = useFirestore();
  const [sharePopupVisible, setSharePopUpVisible] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [more, setMore] = useState(false);
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    getUserProfileData(tutorial?.created_by)(firebase, firestore, dispatch);
  }, [tutorial]);

  const user = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );
  const addBookmark = async (e) =>{
    const auth = firebase.auth().currentUser
      const test = await firestore
        .collection("cl_user")
        .doc(auth.uid)
        .set({
          bookmarks: [{id:e,isSave:bookmark}]
        },{merge:true}).then(()=>{setBookmark(!bookmark)});
  }
  const getTime = timestamp => {
    return timestamp.toDate().toDateString();
  };
  const handleCopyToClipBoard = () => {
    const inputElement = document.getElementById('profileLinkInput');
    const copybtn =document.getElementById('copybtn')
    copybtn.textContent="copied"
    inputElement.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }

  return (
    <Card className={classes.root} data-testId="codelabz">
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            {user?.photoURL && user?.photoURL.length > 0 ? (
              <img src={user?.photoURL} />
            ) : (
              user?.displayName[0]
            )}
          </Avatar>
        }
        title={
          <React.Fragment>
            <Typography
              component="span"
              variant="h7"
              className={classes.inline}
              color="textPrimary"
              data-testId="UserName"
            >
              {user?.displayName}
            </Typography>
            {tutorial?.owner && (
              <>
                {" for "}
                <Typography
                  component="span"
                  variant="h7"
                  className={classes.inline}
                  color="textPrimary"
                  data-testId="UserOrgName"
                >
                  {tutorial?.owner}
                </Typography>
              </>
            )}
          </React.Fragment>
        }
        subheader={tutorial?.createdAt ? getTime(tutorial?.createdAt) : ""}
      />
      <Link to={`/tutorial/${tutorial?.tutorial_id}`}>
        <CardContent
          className={classes.contentPadding}
          data-testId="codelabzDetails"
        >
          <Typography variant="h5" color="text.primary" data-testId="Title">
            {tutorial?.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            paragraph
            data-testId="Description"
          >
            {tutorial?.summary}
          </Typography>
        </CardContent>
      </Link>
      <CardActions className={classes.settings} disableSpacing>
        <Chip
          label="HTML"
          component="a"
          href="#chip"
          clickable
          variant="outlined"
          className={classes.margin}
        />
        <Typography
          variant="overline"
          display="block"
          className={classes.time}
          data-testId="Time"
        >
          {"10 min"}
        </Typography>
        <div className={classes.grow} />
        <ToggleButtonGroup
          size="small"
          className={classes.small}
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton
            className={classes.small}
            onClick={handleIncrement}
            value="left"
            aria-label="left aligned"
          >
            <KeyboardArrowUpIcon />
            <span>{count}</span>
          </ToggleButton>
          <ToggleButton
            className={classes.small}
            onClick={handleDecrement}
            value="center"
            aria-label="centered"
          >
            <KeyboardArrowDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <button id={`${tutorial.tutorial_id}#`} className={classes.button}  onClick={(e)=>{path.push(`/tutorial/${e.currentTarget.id}comments`)}}>
        <IconButton aria-label="share" data-testId="CommentIcon">
          <ChatOutlinedIcon />
        </IconButton>
        </button>
        <button className={classes.button} onClick={()=>setSharePopUpVisible(!sharePopupVisible)}>
        <IconButton aria-label="add to favorites" data-testId="ShareIcon" >
          <ShareOutlinedIcon />
        </IconButton>
        </button>
        {sharePopupVisible && (<>
                    <div className={classes.shareContainer} onClick={(e)=>e.stopPropagation()}>
                      <div className={classes.cancelButton} onClick={() => setSharePopUpVisible(!sharePopupVisible)}>
                        <CancelOutlined style={{ width: "100%", height: "100%", color: "grey" }} />
                      </div>
                      <div className={classes.socialIconsDiv}>
                        <div className={classes.socialIcon}>
                          <FacebookShareButton url="https://www.youtube.com/">
                            <FacebookIcon size={"100%"} round={true} />
                          </FacebookShareButton>
                        </div>
                        <div className={classes.socialIcon}>
                          <TwitterShareButton url="https://www.youtube.com/">
                            <TwitterIcon size={"100%"} round={true} />
                          </TwitterShareButton>
                        </div>
                        <div className={classes.socialIcon}>
                          <WhatsappShareButton url="https://www.youtube.com/">
                            <WhatsappIcon size={"100%"} round={true} />
                          </WhatsappShareButton>
                        </div>
                        <div className={classes.socialIcon}>
                          <LinkedinShareButton url="https://www.youtube.com/">
                            <LinkedinIcon size={"100%"} round={true} />
                          </LinkedinShareButton>
                        </div>
                      </div>
                      <div className={classes.shareLinkContainer}>
                        <input type="text" id="profileLinkInput" className={classes.shareLinkContainerInput} value="<--Tutorial link here-->" readOnly />
                        <button id="copybtn" onClick={handleCopyToClipBoard} className={classes.shareLinkContainerCopyButton}>COPY</button>
                      </div>
                    </div>
                  </>) }
        <button className={classes.button} id={tutorial.tutorial_id} onClick={(e)=>{addBookmark(e.currentTarget.id);e.preventDefault()}}>          
        <IconButton aria-label="share" data-testId="NotifIcon">
          {bookmark?<TurnedInNotOutlinedIcon />:<TurnedIn />}
        </IconButton>
        </button>
        <button className={classes.button} onClick={()=>{setMore(!more)}}>
        <IconButton aria-label="share" data-testId="MoreIcon">
          <MoreVertOutlinedIcon />
        </IconButton>
        </button>
        {more && 
        <div className={classes.moreContainer} onClick={()=>setMore(!more)} >
          <MenuList>
            <MenuItem><ReportProblemOutlined /><p>Report</p></MenuItem>
            <MenuItem><CancelOutlined /><p>Close</p></MenuItem>
          </MenuList>
        </div>}
      </CardActions>
    </Card>
  );
}
