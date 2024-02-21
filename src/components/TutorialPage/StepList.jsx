import React, { useRef} from "react";
import {
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  icons: {
    width: "20px",
    height: "20px"
  },

  listIcon: {
    minWidth: "20px",
  },

  paper: {
    display: "flex",
    minWidth: "100%",
    border: "none",
    backgrounColor: "transparent",
    boxShadow: "none"
  },

  navLink: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  menuList: {
    border: "none",
    boxShadow: "none"
  },

  menuItem: {
    width: "100%",
    height: "100%",
    borderRadius: "100px",
    paddingTop: "8px",
    paddingBottom: "3px",
    margin: "3px 0 3px 0",
    '&:focus': {
      backgroundColor: "#d8f0fc",
      color: "#0293d9",
    }
  },

  notification: {
    color: "#000000"
  },
  customBadge: {
    color: "#ffffff",
    backgroundColor: "#03AAFA"
  }
}));

/**
 * @description - This component renders the side bar menu
 * @returns
 */
const StepList = ({
  menuItems = [],
  value,
  onStateChange = () => {},
  toggleSlider = () => {},
  style,
  children
}) => {
  const classes = useStyles();
  const { id } = useParams();

  /**
   * * Cases for rendering the menu items
   *
   * ? 1. item.link - If the item has a link, render a NavLink
   * ? 2. item.onClick - If the item has an onClick, render a button
   * ? if the item has neither, render a MenuItem with no onClick
   *
   */

  const containerRef = useRef(null);
  const clickedItemRef = useRef(null);

  const handleScrollTo = (item) => {
    
    if (containerRef.current && item.id) {

      const targetElement = document.getElementById(item.id);
      
      if (targetElement) {
        console.log("item", item);
        const yOffset = -75; // Adjust the offset as needed
        const targetOffset = targetElement.offsetTop + yOffset;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth',
        });
      }
      clickedItemRef.current?.focus();
    }
  };
  return (
    <Paper className={classes.paper} style={style}>
      <div ref={containerRef} className={classes.scrollContainer}>
        <MenuList className={classes.menuList}>
          {menuItems.map((item, index) => (
            <div
              key={`menu-item-${index}`}
              style={
                item.id === location.href.split("#")[1]
                  ? { background: "#d8f0fc", borderRadius: "100px", color: "#0293d9" }
                  : {}
              }
              data-testId={item?.dataTestId}
            >
              {item.id && (
                <MenuItem
                  key={item.id}
                  onClick={() => {
                    toggleSlider();
                    onStateChange(index);
                    handleScrollTo(item);
                  }}
                  className={classes.menuItem}
                  ref={(ref) => {
                    if (item.id === location.href.split("#")[1]) {
                      clickedItemRef.current = ref; // Save ref for the clicked item
                    }
                  }}
                >
                  {item && (
                    <ListItemIcon className={classes.listIcon}>
                      <Avatar
                        sx={{ height: "1.5rem", width: "1.5rem"}}
                      >
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    data-testId={item.title}
                    sx={{ whiteSpace: "pre-line" }}
                    style={{
                      fontWeight:
                        item?.id && value === item?.id ? "bold" : "normal"                          
                    }}
                    disableTypography
                  >
                    {item.title}
                  </ListItemText>
                </MenuItem>
              )}
              {!item.link && item.onClick && (
                <MenuItem
                  key={item.title}
                  onClick={() => {
                    item.onClick(item);
                    onStateChange(item);
                    handleScrollTo(item);
                  }}
                  className={classes.menuItem}
                >
                  <ListItemText
                    data-testId={item.title}
                    style={{
                      fontWeight:
                        item?.id && value === item?.id ? "bold" : "normal",
                      color:
                        item?.link === location.pathname ? "#0293d9" : "black",
                    }}
                    disableTypography
                  >
                    {item.title}
                  </ListItemText>
                </MenuItem>
              )}
            </div>
          ))}
          {children}
        </MenuList>
      </div>
    </Paper>
  );
};

export default StepList;