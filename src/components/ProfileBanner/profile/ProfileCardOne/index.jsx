import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button, Menu, MenuItem, Snackbar } from "@mui/material";

// import dp from "../../../../assets/images/demoperson1.jpeg";
import iconbuttonImage from "../../../../assets/images/Filled3dots.svg";
import { Link, useParams } from "react-router-dom";
import { FollowUnfollowButton } from "./FollowUnfollowButton";
import FollowersAndFollowings from "./FollowersAndFollowings";

export default function ProfileCardOne({
  profileImage,
  name,
  story,
  followers,
  following,
  isFollowing = true,
  showFollowButton = false
}) {
  const { handle } = useParams();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openSnackbar, setOpenSnackbar] = useState(false);

  return (
    <>
      <div
        className={classes.profileRightTop}
        data-testId="user_profile_card_one"
      >
        <div className={classes.profileCover}>
          <div className={classes.profileInfo}>
            <div>
              <img
                className={classes.profileUserImg}
                src={profileImage}
                alt="Avatar"
                data-testId="user_profile_card_one_avatar"
              />
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
                <FollowersAndFollowings
                  initialFollowers={followers}
                  initialFollowings={following}
                />
              </Grid>
              <Grid
                item
                container
                style={{ marginTop: "15px" }}
                data-testId="user_profile_card_one_buttonGroup"
              >
                {showFollowButton ? (
                  <FollowUnfollowButton isFollowing={isFollowing} />
                ) : null}

                <div>
                  <Button
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setOpenSnackbar(true);
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className={classes.profileShareButton}
                  >
                    Share
                  </Button>
                  <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={openSnackbar}
                    autoHideDuration={2000}
                    onClose={() => setOpenSnackbar(false)}
                    message="Copied to clipboard"
                  />
                </div>
                <button className={classes.profileReportButton}>Report</button>

                {!handle ? (
                  <React.Fragment>
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
                  </React.Fragment>
                ) : null}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
