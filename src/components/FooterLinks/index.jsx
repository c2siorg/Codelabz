import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import React from "react";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  "& > *": {
    margin: theme.spacing(0.5)
  },
  marginBottom: "1rem",
  border: "none",
  backgroundColor: "transparent",
  boxShadow: "none"
}));

const StyledChip = styled(Chip)(() => ({
  margin: "0px 10px 10px 0px",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer"
}));

const FooterLinks = props => {
  return (
    <StyledCard>
      <CardContent>
        {props.elements.map(function (el, index) {
          return (
            // Fix: added key prop to prevent React duplicate key warning
            <a key={el.link || index} href={el.link}>
              <StyledChip
                size="small"
                label={el.name}
                id={index}
              />
            </a>
          );
        })}
      </CardContent>
    </StyledCard>
  );
};

export default FooterLinks;