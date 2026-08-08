import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography, Divider } from "@mui/material";
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

const FooterLink = ({ icon, text, link }) => (
  <Box display="flex" alignItems="center" mb={1}>
    {icon}
    <Typography
      variant="body2"
      component="a"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: "#B0B0B0",
        textDecoration: "none",
        ml: 1,
        transition: "color 0.3s",
        "&:hover": { color: "#FFFFFF" },
      }}
    >
      {text}
    </Typography>
  </Box>
);

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2C2C2C, #1E1E1E)",
        color: "#E0E0E0",
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              sx={{ color: "#FFFACD", fontWeight: "bold" }}
              gutterBottom
            >
              <Link to="/" style={{ textDecoration: "none", color: "#FFFACD" }}>
                CodeLabz
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
              Live to learn, learn to live.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              About
            </Typography>
            <FooterLink
              icon={<HelpOutlineOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="About CodeLabz"
              link="https://github.com/scorelab/Codelabz"
            />
            <FooterLink
              icon={<CheckOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="Terms and Conditions"
              link="https://github.com/scorelab/Codelabz"
            />
            <FooterLink
              icon={<LockOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="Privacy and Security"
              link="https://github.com/scorelab/Codelabz"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Help
            </Typography>
            <FooterLink
              icon={<ListOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="FAQ"
              link="https://github.com/scorelab/Codelabz"
            />
            <FooterLink
              icon={<GitHubIcon sx={{ color: "#B0B0B0" }} />}
              text="GitHub"
              link="https://github.com/scorelab/Codelabz"
            />
            <FooterLink
              icon={<BugReportOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="Report a Bug"
              link="https://github.com/scorelab/Codelabz/issues"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Contact
            </Typography>
            <FooterLink
              icon={<PhoneEnabledOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="+94 712 345 678"
              link="tel:+94712345678"
            />
            <FooterLink
              icon={<MailOutlineOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="contact@codelabz.io"
              link="mailto:contact@codelabz.io"
            />
            <FooterLink
              icon={<HomeOutlinedIcon sx={{ color: "#B0B0B0" }} />}
              text="64, Singh Labs, Kings Canyon"
              link="https://www.google.com/maps/place/Sri+Lanka/@7.8571778,78.4609778,7z/data=!3m1!4b1!4m5!3m4!1s0x3ae2593cf65a1e9d:0xe13da4b400e2d38c!8m2!3d7.873054!4d80.771797"
            />
          </Grid>
        </Grid>
        <Divider sx={{ backgroundColor: "#444", my: 4 }} />
        <Box textAlign="center">
          <CopyrightOutlinedIcon sx={{ verticalAlign: "middle", color: "#B0B0B0" }} />{" "}
          {new Date().getFullYear()} CodeLabz
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
