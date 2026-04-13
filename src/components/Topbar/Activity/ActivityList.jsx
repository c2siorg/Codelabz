import React, { memo, useCallback } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Stack } from "@mui/system";

const useStyles = makeStyles(theme => ({
  root: {},
  defaultButton: {
    padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
    textDecoration: "none",
    textTransform: "none",
    margin: `${theme.spacing(0)}px ${theme.spacing(0)}px ${theme.spacing(
      0
    )}px ${theme.spacing(1)}px`,
    border: "none",

    "&:hover": {
      border: "none",
      backgroundColor: theme.palette.grey[100]
    }
  },
  activeButton: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.primary.main
  },
  inactiveButton: {
    color: theme.palette.text.secondary
  }
}));

const ActivityButton = memo(function ActivityButton({
  id,
  icon: Icon,
  text,
  isActive,
  onToggle,
  defaultButtonClassName,
  activeButtonClassName,
  inactiveButtonClassName
}) {
  const handleClick = useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  return (
    <Button
      variant="outlined"
      color="primary"
      className={`
        ${defaultButtonClassName}
        ${isActive ? activeButtonClassName : inactiveButtonClassName}
      `}
      disableRipple
      disableElevation
      onClick={handleClick}
    >
      {Icon && (
        <Icon
          fontSize="small"
          style={{
            marginRight: "6px"
          }}
        />
      )}
      <Typography variant="body1">{text}</Typography>
    </Button>
  );
});

function ActivityList({
  value,
  toggle,
  activityList,
  acitvitylist,
  classname
}) {
  const classes = useStyles();
  const items = activityList || acitvitylist || [];

  return (
    <React.Fragment>
      <Grid container spacing={2} className={classname}>
        <Grid item xs={12}>
          <Stack spacing={2} direction={"row"}>
            {items.map((item, index) => (
              <ActivityButton
                key={item.id ?? index}
                id={item.id}
                icon={item.icon}
                text={item.text}
                isActive={value === item.id}
                onToggle={toggle}
                defaultButtonClassName={classes.defaultButton}
                activeButtonClassName={classes.activeButton}
                inactiveButtonClassName={classes.inactiveButton}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default memo(ActivityList);
