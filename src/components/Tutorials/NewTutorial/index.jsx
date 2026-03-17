import React, { useEffect, useMemo, useState } from "react";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createTutorial, getProfileData } from "../../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import { Alert, Box, Chip } from "@mui/material";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@mui/styles";
import { deepPurple } from "@mui/material/colors";
import { Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import MovieIcon from "@mui/icons-material/Movie";
import Select from "react-select";
import { common } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

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
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "1rem",
    marginBottom: "1rem"
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  button: {
    marginLeft: theme.spacing(1),
    padding: "0.4rem 0.4rem"
  }
}));

const NewTutorial = ({ viewModal, onSidebarClick, viewCallback, active }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [formValue, setformValue] = useState({
    title: "",
    summary: "",
    owner: "",
    tags: []
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

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

  useEffect(() => {
    setformValue(prev => ({
      ...prev,
      tags: tags
    }));
  }, [tags]);

  const organizations = useSelector(
    ({
      profile: {
        data: { organizations }
      }
    }) => organizations
  );
  // console.log("organizations", organizations);

  useEffect(() => {
    if (!organizations) {
      getProfileData()(firebase, firestore, dispatch);
    }
  }, [firestore, firebase, dispatch, organizations]);

  const userHandle = useSelector(
    ({
      firebase: {
        profile: { handle }
      }
    }) => handle
  );

  const displayName = useSelector(
    ({
      firebase: {
        profile: { displayName }
      }
    }) => displayName
  );

  //This name should be replaced by displayName when implementing backend
  const sampleName = "User Name Here";
  const allowOrgs = organizations && organizations.length > 0;

  const orgList =
    allowOrgs > 0
      ? organizations
          .map((org, i) => {
            if (org.permissions.includes(3) || org.permissions.includes(2)) {
              return org;
            } else {
              return null;
            }
          })
          .filter(Boolean)
      : null;

  useEffect(() => {
    setTags([]);
    setNewTag("");
    setformValue({
      title: "",
      summary: "",
      owner: userHandle || "",
      tags: []
    });
    setMediaFiles([]);
    setVisible(viewModal);
  }, [viewModal, userHandle]);

  const onSubmit = formData => {
    formData.preventDefault();
    const tutorialData = {
      ...formValue,
      owner: formValue.owner || userHandle,
      created_by: userHandle,
      is_org: userHandle !== formValue.owner,
      completed: false,
      mediaFiles: mediaFiles
    };
    console.log(tutorialData);
    createTutorial(tutorialData)(firebase, firestore, dispatch, history);
  };

  const handleFileUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const storagePath = `tutorials/media/${Date.now()}_${file.name}`;
    const storageRef = firebase.storage().ref(storagePath);
    const uploadTask = storageRef.put(file);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      error => {
        console.error("Upload failed", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        const newMedia = {
          name: file.name,
          url: downloadURL,
          type: file.type,
          path: storagePath
        };
        setMediaFiles(prev => [...prev, newMedia]);
        setUploading(false);
        setUploadProgress(0);
      }
    );
  };

  const removeMedia = index => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onOwnerChange = value => {
    setformValue(prev => ({
      ...prev,
      owner: value
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setformValue(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = tagToDelete => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const classes = useStyles();
  const ownerOptions = useMemo(() => {
    const options = [];
    if (userHandle) {
      options.push({
        value: userHandle,
        label: displayName || userHandle
      });
    }

    if (orgList && orgList.length > 0) {
      orgList.forEach(org => {
        options.push({
          value: org.org_handle,
          label: org.org_name
        });
      });
    }

    return options;
  }, [userHandle, displayName, orgList]);

  return (
    <Modal
      open={visible}
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
          width: "min(40rem, 92vw)",
          background: "white",
          padding: "2rem",
          paddingTop: "1rem",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        {error && (
          <Alert message={""} type="error" closable="true" className="mb-24">
            description={"Tutorial Creation Failed"}
          </Alert>
        )}
        <Typography variant="h5">Create a Tutorial</Typography>
        <Box
          sx={{
            py: 2,
            width: "50%"
          }}
        >
          <Typography>
            <Select
              options={ownerOptions}
              value={
                ownerOptions.find(option => option.value === formValue.owner) ||
                null
              }
              onChange={data => {
                onOwnerChange(data.value);
              }}
              id="orgSelect"
            />
          </Typography>
        </Box>

        <form id="tutorialNewForm">
          <TextField
            prefix={
              <AppstoreAddOutlined style={{ color: "rgba(0,0,0,.25)" }} />
            }
            placeholder="Title of the Tutorial"
            autoComplete="title"
            name="title"
            variant="outlined"
            fullWidth
            data-testId="newTutorial_title"
            id="newTutorialTitle"
            style={{ marginBottom: "2rem" }}
            onChange={e => handleChange(e)}
          />

          <TextField
            prefix={
              <AppstoreAddOutlined style={{ color: "rgba(0,0,0,.25)" }} />
            }
            fullWidth
            variant="outlined"
            name="summary"
            placeholder="Summary of the Tutorial"
            autoComplete="summary"
            id="newTutorialSummary"
            data-testId="newTutorial_summary"
            onChange={e => handleChange(e)}
            style={{ marginBottom: "2rem" }}
          />

          <TextField
            label="Enter a tag"
            variant="outlined"
            size="small"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleAddTag}
          >
            Add Tag
          </Button>

          <div className={classes.tagsContainer}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                className={classes.chip}
                deleteIcon={<CloseIcon />}
              />
            ))}
          </div>

          <input
            type="file"
            multiple={false}
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          <IconButton onClick={() => fileInputRef.current.click()}>
            <ImageIcon />
          </IconButton>
          <IconButton onClick={() => fileInputRef.current.click()}>
            <MovieIcon />
          </IconButton>
          <IconButton onClick={() => fileInputRef.current.click()}>
            <DescriptionIcon />
          </IconButton>

          {uploading && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          <List>
            {mediaFiles.map((file, index) => (
              <ListItem key={index}>
                <Avatar sx={{ mr: 2 }}>
                  {file.type.startsWith("image/") ? (
                    <ImageIcon />
                  ) : file.type.startsWith("video/") ? (
                    <MovieIcon />
                  ) : (
                    <InsertDriveFileIcon />
                  )}
                </Avatar>
                <ListItemText
                  primary={file.name}
                  secondary={file.type}
                  primaryTypographyProps={{ noWrap: true }}
                />
                <Box sx={{ mr: 2, maxWidth: "120px" }}>
                  {file.type.startsWith("image/") && (
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{ width: "100%", borderRadius: "6px" }}
                    />
                  )}
                  {file.type.startsWith("video/") && (
                    <video
                      src={file.url}
                      controls
                      style={{ width: "100%", borderRadius: "6px" }}
                    />
                  )}
                  {file.type === "application/pdf" && (
                    <a href={file.url} target="_blank" rel="noreferrer">
                      Preview PDF
                    </a>
                  )}
                </Box>
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeMedia(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <div className="mb-0">
            <div style={{ float: "right" }}>
              <Button
                key="back"
                onClick={() => {
                  onSidebarClick();
                  setTags([]);
                  setNewTag("");
                  setformValue({
                    title: "",
                    summary: "",
                    owner: userHandle || "",
                    tags: []
                  });
                }}
                id="cancelAddTutorial"
              >
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                variant="contained"
                color="secondary"
                htmlType="submit"
                loading={loading}
                onClick={e => onSubmit(e)}
                data-testid="newTutorialSubmit"
                sx={{
                  bgcolor: "#03AAFA",
                  borderRadius: "30px",
                  color: common.white,
                  "&:hover": {
                    bgcolor: "#03AAFA"
                  }
                }}
                disabled={
                  formValue.title === "" ||
                  formValue.summary === "" ||
                  (formValue.owner === "" && !userHandle)
                }
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewTutorial;
