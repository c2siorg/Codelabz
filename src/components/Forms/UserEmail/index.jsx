import React, { useState } from "react";
import useStyles from "./styles";
import data from "./emailAddressConfig.json";
import {
  Box,
  Card,
  FormControl,
  Typography,
  MenuItem,
  Select,
  OutlinedInput,
  Button
} from "@mui/material";
import { backupEmailUpdate } from "../../../store/actions/profileActions";
import { Input } from "../../ui-helpers/Inputs/PrimaryInput";
import { useSelector, useDispatch } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { set } from "lodash";

const UserEmail = () => {
  const classes = useStyles();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const profileData = useSelector(({ firebase: { profile } }) => profile);
  const [primaryEmail, setPrimaryEmail] = useState(data.primaryEmail);
  const [backupEmail, setBackupEmail] = useState(profileData.backupEmail ? profileData.backupEmail : []);
  const [prevEmail, setPrevEmail] = useState(profileData.backupEmail ? profileData.backupEmail[0] : []);

  const [newEmail, setNewEmail] = useState("");

  const handleChangePrimaryEmail = event => {
    setPrimaryEmail(event.target.value);
  };

  const handleChangeBackupEmail = event => {
    setBackupEmail(event.target.value);
  };

  const handler = (e) => {
    e.preventDefault();
    if (newEmail.length > 0) {
      const data = [...backupEmail, newEmail]
      setBackupEmail(data);
      backupEmailUpdate(profileData.uid, data)(firebase, firestore, dispatch);
      setNewEmail("");
    }
  }

  return (
    <Card className={classes.card}>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography style={{ margin: "5px 0" }}>
          {data.primaryEmail} -{" "}
          <Typography variant="span" style={{ color: "#039500" }}>
            Primary
          </Typography>
        </Typography>
        <Box>
          <Typography style={{ margin: "5px 0" }}>Add email address</Typography>
          <Box
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <Input
              placeholder="email"
              className={classes.input}
              data-testId="emailInput"
              value={newEmail}
              onChange={e => { setNewEmail(e.target.value) }}
            />
            <Button>
              <Typography data-testId="addEmail" onClick={handler}>Add</Typography>
            </Button>
          </Box>
        </Box>
        <Box className={classes.email}>
          <Typography className={classes.text} style={{ marginRight: 30 }}>
            Primary email address
          </Typography>
          <FormControl data-testId="primaryEmail">
            <Select
              value={profileData.email}
              onChange={handleChangePrimaryEmail}
              input={<OutlinedInput style={{ height: 40, width: 250 }} />}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem
                value={profileData.email}
                data-testId="primaryEmailItem"
              >
                {profileData.email}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box className={classes.email}>
          <Typography className={classes.text} style={{ marginRight: 30 }}>
            Backup email address
          </Typography>
          <FormControl data-testId="backupEmail">
            <Select
              value={prevEmail}
              onChange={handleChangeBackupEmail}
              input={<OutlinedInput style={{ height: 40, width: 250 }} />}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {backupEmail?.map(email => (
                <MenuItem value={email} data-testId="backupEmailItem">
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Card>
  );
};

export default UserEmail;
