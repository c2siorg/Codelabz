import React from "react";
import { Link } from "react-router-dom";
import BrandName from "../../helpers/brandName";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
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

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#455A64",
  textDecoration: "none",
  fontSize: "14px",
  padding: "6px 0"
};

const iconStyle = { color: "#3AAFA9", fontSize: "18px" };

const headingStyle = {
  color: "#1C2B36",
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "16px",
  marginTop: "0"
};

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        borderTop: "3px solid #3AAFA9",
        paddingTop: "48px",
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <Grid container direction="row">
        <Grid
          item
          sm={12}
          xs={12}
          md={3}
          style={{ padding: "0 24px 24px 24px" }}
        >
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <BrandName />
          </Link>
          <p style={{ color: "#637381", fontSize: "14px", marginTop: "8px" }}>
            Live to learn, learn to live.
          </p>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={{ padding: "0 24px 32px 24px" }}
        >
          <h3 style={headingStyle}>About</h3>
          <a
            href="https://github.com/scorelab/Codelabz"
            target="_blank"
            rel="noreferrer noopener"
            style={linkStyle}
          >
            <HelpOutlineOutlinedIcon style={iconStyle} /> About CodeLabz
          </a>
          <a
            href="https://github.com/scorelab/Codelabz"
            target="_blank"
            rel="noreferrer noopener"
            style={linkStyle}
          >
            <CheckOutlinedIcon style={iconStyle} /> Terms and Conditions
          </a>
          <a
            href="https://github.com/scorelab/Codelabz"
            target="_blank"
            rel="noreferrer noopener"
            style={linkStyle}
          >
            <LockOutlinedIcon style={iconStyle} /> Privacy and Security
          </a>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={{ padding: "0 24px 32px 24px" }}
        >
          <h3 style={headingStyle}>Help</h3>
          <a
            href="https://github.com/scorelab/Codelabz"
            target="_blank"
            rel="noreferrer noopener"
            style={linkStyle}
          >
            <ListOutlinedIcon style={iconStyle} /> FAQ
          </a>
          <a
            href="https://github.com/scorelab/Codelabz"
            target="_blank"
            rel="noreferrer noopener"
            style={linkStyle}
          >
            <GitHubIcon style={iconStyle} /> GitHub
          </a>
          <a
            href="https://github.com/scorelab/Codelabz/issues"
            target="_blank"
            rel="noreferrer noopener"
            style={linkStyle}
          >
            <BugReportOutlinedIcon style={iconStyle} /> Report a Bug
          </a>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          style={{ padding: "0 24px 32px 24px" }}
        >
          <h3 style={headingStyle}>Contact</h3>
          <a href="tel:+94712345678" style={linkStyle}>
            <PhoneEnabledOutlinedIcon style={iconStyle} /> +94 712 345 678
          </a>
          <a href="mailto:contact@codelabz.io" style={linkStyle}>
            <MailOutlineOutlinedIcon style={iconStyle} /> contact@codelabz.io
          </a>
          <a
            href="https://www.google.com/maps/place/Sri+Lanka"
            target="_blank"
            rel="noreferrer noopener"
            style={linkStyle}
          >
            <HomeOutlinedIcon style={iconStyle} /> 64, Singh Labs, Kings Canyon
          </a>
        </Grid>
      </Grid>

      <Divider />

      <div
        style={{
          backgroundColor: "#1C2B36",
          padding: "14px 24px",
          marginTop: "8px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            color: "#9aacb8",
            fontSize: "13px"
          }}
        >
          <CopyrightOutlinedIcon style={{ fontSize: "16px" }} />
          {new Date().getFullYear()} CodeLabz — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
