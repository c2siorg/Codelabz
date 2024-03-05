import React from "react";
import { Link } from "react-router-dom";
import BrandName from "../../helpers/brandName";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { makeStyles } from "@mui/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CopyrightOutlinedIcon from "@mui/icons-material/CopyrightOutlined";

const Footer = () => {
  const useStyles = makeStyles({
    item: {
      display: "flex",
      alignItems: "left",
      justifyContent: "flex-start",
      marginBottom:'5px',
    },
    link: {
      textDecoration: 'none',
      color: '#000',
      display: 'flex',
      alignItems: 'center',
    }
  });
  const classes = useStyles();
  return (
    <footer className="light-grey-bg pt-16 pb-16">
      <Grid container direction="row">
        <Grid item sm={12} xs={12} md={3} className="col-pad-24">
          <h2 style={{ color: "#3AAFA9" }} className="brand-font mb-0">
            <Link to={"/"}>
              <BrandName />
            </Link>
          </h2>
          <p className="mb-">Live to learn, learn to live.</p>
        </Grid>

        <Grid item xs={12} sm={12} md={3} className="col-pad-24">
          <h3 className="mb-16 ml-8">About</h3>
          <div className="mt-8 mb-8">
            <a
              href="https://github.com/c2siorg/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <HelpOutlineOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                &nbsp; About CodeLabz
              </Grid>
            </a>
          </div>
          <div className="mt-8 mb-8">
            <a
              href="https://github.com/c2siorg/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <CheckOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                &nbsp;Terms and conditions
              </Grid>
            </a>
          </div>
          <div className="mt-8 mb-8">
            <a
              href="https://github.com/c2siorg/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <LockOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                &nbsp;Privacy and security
              </Grid>
            </a>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={3} className="col-pad-24">
          <h3 className="mb-16">Help</h3>
          <div className="mt-8 mb-8">
            <a
              href="https://github.com/c2siorg/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <ListOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />
                &nbsp;FAQ
              </Grid>
            </a>
          </div>
          <div className="mt-8 mb-8">
            <a
              href="https://github.com/c2siorg/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <GitHubIcon className="mr-8" style={{ color: "#455A64" }} />{" "}
                &nbsp;GitHub
              </Grid>
            </a>
          </div>
          <div className="mt-8 mb-8">
            <a
              href="https://github.com/c2siorg/Codelabz/issues"
              target="_blank"
              rel="noreferrer noopener"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <BugReportOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                &nbsp;Report a bug
              </Grid>
            </a>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={3} className="col-pad-24">
          <h3 className="mb-16">Contact</h3>
          <div className="mt-8 mb-8">
            <a href="tel: +94712345678" className={`mb-8 mt-8 footer-link ${classes.link}`}>
              <PhoneEnabledOutlinedIcon
                className="mr-8"
                style={{ color: "#455A64" }}
              />{" "}
              &nbsp;+94 712 345 678
            </a>
          </div>
          <div className="mt-8 mb-8">
            <a
              href="mailto: contact@codelabz.com"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <MailOutlineOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                &nbsp;contact@codelabz.io
              </Grid>
            </a>
          </div>
          <div className="mt-8 mb-8">
            <a
              href="https://www.google.com/maps/place/Sri+Lanka/@7.8571778,78.4609778,7z/data=!3m1!4b1!4m5!3m4!1s0x3ae2593cf65a1e9d:0xe13da4b400e2d38c!8m2!3d7.873054!4d80.771797"
              target="_blank"
              rel="noreferrer noopener"
              className={`mb-8 mt-8 footer-link ${classes.link}`}
            >
              <Grid className={classes.item}>
                <HomeOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                &nbsp;64, Singh Labs, Kings Canyon
              </Grid>
            </a>
          </div>
        </Grid>
      </Grid>

      <Divider sx={{ borderBottomWidth: 2,bgcolor:'black',marginTop:'5px' }} />
       <Grid container className="pt-16 pb-0 mt-4">
        <Grid
          item
          xs={12}
          className="center"
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            marginTop:'10px'
          }}
        >
          <CopyrightOutlinedIcon /> {new Date().getFullYear()} CodeLabz
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
