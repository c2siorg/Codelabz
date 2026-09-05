import React from "react";
import { Link } from "react-router-dom";
import BrandName from "../../helpers/brandName";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
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

const FooterItem = styled(Grid)(() => ({
  display: "flex",
  alignItems: "left",
  justifyContent: "flex-start"
}));

const Footer = () => {
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
          <h3 className="mb-16">About</h3>
          <div className="mt-8 mb-8">
            
              href="https://github.com/scorelab/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className="mb-8 mt-8 footer-link"
            >
              <FooterItem>
                <HelpOutlineOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                About CodeLabz
              </FooterItem>
            </a>
          </div>
          <div className="mt-8 mb-8">
            
              href="https://github.com/scorelab/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className="mb-8 mt-8 footer-link"
            >
              <FooterItem>
                <CheckOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                Terms and conditions
              </FooterItem>
            </a>
          </div>
          <div className="mt-8 mb-8">
            
              href="https://github.com/scorelab/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className="mb-8 mt-8 footer-link"
            >
              <FooterItem>
                <LockOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                Privacy and security
              </FooterItem>
            </a>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={3} className="col-pad-24">
          <h3 className="mb-16">Help</h3>
          <div className="mt-8 mb-8">
            
              href="https://github.com/scorelab/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className=" footer-link"
            >
              <FooterItem>
                <ListOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />
                FAQ
              </FooterItem>
            </a>
          </div>
          <div className="mt-8 mb-8">
            
              href="https://github.com/scorelab/Codelabz"
              target="_blank"
              rel="noreferrer noopener"
              className="mb-8 mt-8 footer-link"
            >
              <FooterItem>
                <GitHubIcon className="mr-8" style={{ color: "#455A64" }} />{" "}
                GitHub
              </FooterItem>
            </a>
          </div>
          <div className="mt-8 mb-8">
            
              href="https://github.com/scorelab/Codelabz/issues"
              target="_blank"
              rel="noreferrer noopener"
              className="mb-8 mt-8 footer-link"
            >
              <FooterItem>
                <BugReportOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                Report a bug
              </FooterItem>
            </a>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={3} className="col-pad-24">
          <h3 className="mb-16">Contact</h3>
          <div className="mt-8 mb-8">
            <a href="tel: +94712345678" className="mb-8 mt-8 footer-link">
              <PhoneEnabledOutlinedIcon
                className="mr-8"
                style={{ color: "#455A64" }}
              />{" "}
              +94 712 345 678
            </a>
          </div>
          <div className="mt-8 mb-8">
            
              href="mailto: contact@codelabz.com"
              className="mb-8 mt-8 footer-link"
            >
              <FooterItem>
                <MailOutlineOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                contact@codelabz.io
              </FooterItem>
            </a>
          </div>
          <div className="mt-8 mb-8">
            
              href="https://www.google.com/maps/place/Sri+Lanka/@7.8571778,78.4609778,7z/data=!3m1!4b1!4m5!3m4!1s0x3ae2593cf65a1e9d:0xe13da4b400e2d38c!8m2!3d7.873054!4d80.771797"
              target="_blank"
              rel="noreferrer noopener"
              className="mb-8 mt-8 footer-link"
            >
              <FooterItem>
                <HomeOutlinedIcon
                  className="mr-8"
                  style={{ color: "#455A64" }}
                />{" "}
                64, Singh Labs, Kings Canyon
              </FooterItem>
            </a>
          </div>
        </Grid>
      </Grid>

      <Divider />
      <Grid container className="pt-16 pb-0">
        <Grid
          item
          xs={12}
          className="center"
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center"
          }}
        >
          <CopyrightOutlinedIcon /> {new Date().getFullYear()} CodeLabz
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
