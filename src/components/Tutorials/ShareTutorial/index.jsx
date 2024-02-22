import React, { useEffect, useState } from "react";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
import { deepPurple } from "@mui/material/colors";
import { Typography } from "@mui/material";


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    paddingTop: "8px",
    paddingBottom: "10px"
  },
  item: {
    margin: "10px"
  },
  purple: {
    color: deepPurple[700],
    backgroundColor: deepPurple[500]
  }
}));

const ShareTutorial = ({ tutorial, openShare, setOpenShare,onSidebarClick }) => {

  const [loading, setLoading] = useState(false);
  console.log(tutorial)
  const [error, setError] = useState(false);
 

  const loadingProp = useSelector(
    ({
      tutorials: {
        create: { loading }
      }
    }) => loading
  );
  const errorProp = useSelector(
    ({
      tutorials: {
        create: { error }
      }
    }) => error
  );

  useEffect(() => {
    setLoading(loadingProp);
  }, [loadingProp]);

  useEffect(() => {
    setError(errorProp);
  }, [errorProp]);

 



 


  const classes = useStyles();
  return (
    <Modal
      open={openShare}
      onClose={onSidebarClick}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        data-testId="tutorialNewModal"
        style={{
          height: "auto",
          width: "auto",
          background: "white",
          padding: "2rem",
          paddingTop: "1rem",
          maxWidth: "80%"
        }}
      >
        {error && (
          <Alert message={""} type="error" closable="true" className="mb-24">
            description={"Tutorial Creation Failed"}/
          </Alert>
        )}
        <Typography variant="h5">Share a Tutorial</Typography>
        <Box
          sx={{
            py: 2,
            width: "50%"
          }}
        >
          <Typography>
            <div>
            {`http://localhost:5173/tutorial/` + tutorial?.tutorial_id}
            </div>
          </Typography>
        </Box>
          <div onClick={onSidebarClick}>Close</div>
        
      </div>
    </Modal>
  );
};

export default ShareTutorial;
