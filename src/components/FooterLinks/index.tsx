import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: any) => ({
  root: {
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
  },
  chip: {
    margin: "0px 10px 10px 0px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer"
  }
}));

interface FooterLinkElement {
  name: string;
  link: string;
}

interface FooterLinksProps {
  elements: FooterLinkElement[];
}

const FooterLinks: React.FC<FooterLinksProps> = ({ elements }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        {elements.map((el, index) => (
          <a key={`${el.link}-${index}`} href={el.link}>
            <Chip
              size="small"
              label={el.name}
              id={`${index}`}
              className={classes.chip}
            />
          </a>
        ))}
      </CardContent>
    </Card>
  );
};

export default FooterLinks;
