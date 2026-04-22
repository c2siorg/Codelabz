import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Paper
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";

const StyledPaper = styled(Paper)(() => ({
  display: "flex",
  minWidth: "100%",
  border: "none",
  backgroundColor: "transparent",
  boxShadow: "none"
}));

const StyledMenuList = styled(MenuList)(() => ({
  border: "none",
  boxShadow: "none",
  width: "100%"
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  width: "100%",
  height: "100%",
  borderRadius: "100px",
  paddingTop: "8px",
  paddingBottom: "3px",
  margin: "3px 0 3px 0"
}));

const NavLinkStyled = styled(NavLink)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
}));

const iconStyles = {
  width: "20px",
  height: "20px"
};

const listIconStyles = {
  minWidth: "20px",
  marginRight: "10px"
};

const customBadgeSx = {
  "& .MuiBadge-badge": {
    color: "#ffffff",
    backgroundColor: "#03AAFA",
    fontSize: "0.6rem",
    height: "16px",
    minWidth: "16px"
  }
};

const SideList = ({
  menuItems = [],
  value,
  onStateChange = () => {},
  toggleSlider = () => {},
  style,
  children,
  notificationCount
}) => {
  const location = useLocation();

  return (
    <StyledPaper style={style}>
      <StyledMenuList>
        {menuItems.map(function (item, index) {
          const itemKey = item.link || item.name || index;

          const textStyle = {
            fontWeight: item?.id && value === item?.id ? "bold" : "normal",
            color: item?.link === location.pathname ? "#0293d9" : "black"
          };

          const activeBackground =
            item.link === location.pathname
              ? { background: "#d9f1fc", borderRadius: "100px" }
              : {};

          return (
            <div
              key={itemKey}
              style={activeBackground}
              data-testId={item?.dataTestId}
            >
              {item.link && (
                <NavLinkStyled to={item.link}>
                  <StyledMenuItem
                    onClick={() => {
                      toggleSlider();
                      onStateChange(index);
                    }}
                  >
                    {item.img && (
                      <ListItemIcon style={listIconStyles}>
                        {item.name === "Notifications" ? (
                          <Badge
                            badgeContent={notificationCount}
                            color="primary"
                            sx={customBadgeSx}
                          >
                            <img
                              alt={item.name}
                              src={item.img}
                              style={iconStyles}
                            />
                          </Badge>
                        ) : (
                          <img
                            alt={item.name}
                            src={item.img}
                            style={iconStyles}
                          />
                        )}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      data-testId={item.name}
                      style={textStyle}
                      disableTypography
                    >
                      {item.name}
                    </ListItemText>
                  </StyledMenuItem>
                </NavLinkStyled>
              )}

              {!item.link && !item.onClick && (
                <StyledMenuItem
                  onClick={() => {
                    onStateChange(item);
                    toggleSlider();
                  }}
                >
                  {item.img && (
                    <ListItemIcon style={listIconStyles}>
                      <Badge
                        badgeContent={
                          notificationCount &&
                          (notificationCount > 99 ? "99+" : notificationCount)
                        }
                        color="primary"
                        sx={customBadgeSx}
                      >
                        <NotificationsIcon style={{ color: "#000000" }} />
                      </Badge>
                    </ListItemIcon>
                  )}
                  <ListItemText
                    data-testId={item.name}
                    style={textStyle}
                    disableTypography
                  >
                    {item.name}
                  </ListItemText>
                </StyledMenuItem>
              )}

              {!item.link && item.onClick && (
                <StyledMenuItem
                  onClick={() => {
                    item.onClick(item);
                    onStateChange(item);
                  }}
                >
                  {item.img && (
                    <ListItemIcon style={listIconStyles}>
                      <img
                        alt={item.name}
                        src={item.img}
                        style={iconStyles}
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    data-testId={item.name}
                    style={textStyle}
                    disableTypography
                  >
                    {item.name}
                  </ListItemText>
                </StyledMenuItem>
              )}
            </div>
          );
        })}
        {React.Children.map(children, (child, i) =>
          child ? React.cloneElement(child, { key: `sidebar-child-${i}` }) : null
        )}
      </StyledMenuList>
    </StyledPaper>
  );
};

export default SideList;