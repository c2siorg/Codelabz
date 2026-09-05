import { styled } from "@mui/material/styles";
import React from "react";

const Container = styled("div")(() => ({
  display: "flex",
  alignItems: "center"
}));

const Border = styled("div")(() => ({
  borderBottom: "1px solid lightgray",
  width: "100%"
}));

const Content = styled("span")(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  fontSize: 16,
  color: "rgba(0, 0, 0, 0.85)",
  fontWeight: 500
}));

const Divider = ({ children }) => {
  return (
    <Container>
      <Border />
      <Content>{children}</Content>
      <Border />
    </Container>
  );
};

export default Divider;