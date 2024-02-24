import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import PropTypes from "prop-types";
import Carousel from "./Carousel/index";
import OrgsExplore from "./discoverOrgs/OrgExplore";
import CodelabzExplore from "./DiscoverCodelabz/CodelabzExplore";
import Footer from "../Footer";
import { UserIsAllowedUserDashboard } from "../../auth";

const MyFeed = () => {
  return (
    <>
      <Box style={{ background: "#F9F9F9", color: "#000000", height: "100%" }}>
        <OrgsExplore />
        <CodelabzExplore />
      </Box>
      <Footer />
    </>
  );
};

export default UserIsAllowedUserDashboard(MyFeed);
