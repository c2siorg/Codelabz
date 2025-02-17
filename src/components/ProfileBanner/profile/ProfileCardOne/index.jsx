import React from "react";
import useStyles from "./styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Link } from "react-router-dom";
import iconbuttonImage from "../../../../assets/images/Filled3dots.svg";
import { avatarName } from "../../../../helpers/avatarName";

export default function ProfileCardOne({
  profileImage,
  name,
  story,
  followers,
  following,
  isOwnProfile // New prop to determine if this is the logged-in user's profile
}) {
  const classes = useStyles();
  const acronym = avatarName(name);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className={classes.profileRightTop}
        data-testId="user_profile_card_one"
      >
        <div className={classes.profileCover}>
          <div className={classes.profileInfo}>
            <div>
              <Avatar
                className={classes.profileUserImg}
                src={profileImage}
                alt={name}
                data-testId="user_profile_card_one_avatar"
                sx={{
                  bgcolor: profileImage ? 'transparent' : '#3AAFA9',
                  width: 120,
                  height: 120,
                  fontSize: '3.5rem'
                }}
              >
                {!profileImage && (
                  acronym || <PersonOutlineOutlinedIcon sx={{ fontSize: '2.5rem' }} />
                )}
              </Avatar>
            </div>
            <div className={classes.profileUserConnect}>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography
                    className={classes.profileInfoName}
                    data-testId="user_profile_card_one_name"
                  >
                    {name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={classes.profileInfoStory}
                    data-testId="user_profile_card_one_story"
                  >
                    {story}
                  </Typography>
                </Grid>
                <Grid item container direction="row">
                  <Grid item>
                    <span
                      className={classes.profileInfoData}
                      style={{ marginRight: "20px" }}
                      data-testId="user_profile_card_one_follwerCount"
                    >
                      {followers} followers
                    </span>
                  </Grid>
                  <Grid item>
                    <span
                      className={classes.profileInfoData}
                      style={{ marginRight: "2px" }}
                      data-testId="user_profile_card_one_followingCount"
                    >
                      {following} following
                    </span>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  style={{ marginTop: "15px" }}
                  data-testId="user_profile_card_one_buttonGroup"
                >
                  {!isOwnProfile && (
                    <button
                      className={classes.profileSubscribeButton}
                      data-testId="user_profile_card_one_buttonGroup_followButton"
                    >
                      Follow
                    </button>
                  )}
                  <button className={classes.profileShareButton}>Share</button>
                  <button className={classes.profileReportButton}>
                    Report
                  </button>
                  <button
                    className={classes.profileIconButton}
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <img src={iconbuttonImage} alt="iconbutton" />
                  </button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button"
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left"
                    }}
                  >
                    <Link to="/user-dashboard/settings">
                      <MenuItem onClick={handleClose}>User Settings</MenuItem>
                    </Link>
                  </Menu>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}