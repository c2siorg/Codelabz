import React from "react";
import errorImg from "../../assets/images/404.png";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Wrapper = styled(Grid)(() => ({
  height: "65vh",
  display: "flex",
  alignItems: "center",
  flexFlow: "column",
  justifyContent: "center"
}));

const ErrorImage = styled("img")(({ theme }) => ({
  height: "10rem",
  width: "20rem",
  alignItems: "center",
  [theme.breakpoints.down(750)]: {
    height: "10rem",
    width: "15rem"
  }
}));

const OopsList = styled("ul")(() => ({
  listStyle: "none",
  flexFlow: "row",
  display: "flex",
  marginLeft: "-3rem",
  fontSize: "1.5rem",
  color: "#465E66",
  "& li:nth-of-type(1)": { transform: "rotate(-190deg) translateY(-20px)" },
  "& li:nth-of-type(2)": { transform: "rotate(-10deg)" },
  "& li:nth-of-type(3)": { transform: "rotate(0deg)" },
  "& li:nth-of-type(4)": { transform: "rotate(10deg)" },
  "& li:nth-of-type(5)": { transform: "rotate(10deg)" },
  "& li:nth-of-type(6)": { transform: "rotate(-10deg)" },
  "& li:nth-of-type(7)": { transform: "rotate(10deg)" },
  "& li:nth-of-type(8)": { transform: "rotate(10deg)" },
  "& li:nth-of-type(9)": { transform: "rotate(20deg)" },
  "& li:nth-of-type(10)": { transform: "rotate(20deg)" },
  "& li:nth-of-type(11)": { transform: "rotate(1deg)" }
}));
// ────────────────────────────────────────────────────────────────

const NotFound = ({ background = "white", textColor = "black" }) => {
  return (
    <Wrapper
      container
      className="row-fullheight"
      style={{ background: background }}
      data-testId="errorPage"
    >
      <Grid
        item
        style={{ padding: "0", marginTop: "-5rem", marginLeft: "2rem" }}
      >
        <ErrorImage src={errorImg} alt="404 error - page not found" />
      </Grid>
      <Grid
        item
        style={{ marginTop: "2rem", display: "flex", alignItems: "center" }}
      >
        <Typography variant="h2" style={{ color: textColor }}>
          Oops!
        </Typography>
      </Grid>
      <Grid item>
        <OopsList style={{ color: textColor }}>
          <li>P</li>
          <li>A</li>
          <li>G</li>
          <li>E</li>
          <li>!</li>
          <li style={{ fontSize: "1.5rem", marginLeft: "1rem" }}>B</li>
          <li>R</li>
          <li>O</li>
          <li>K</li>
          <li>E</li>
          <li>N</li>
        </OopsList>
      </Grid>
      <Grid item style={{ marginTop: "0" }}>
        <Typography variant="body" style={{ color: textColor }}>
          We can't seem to find the page you are looking for
        </Typography>
      </Grid>
    </Wrapper>
  );
};

export default NotFound;