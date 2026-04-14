import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  createTutorial,
  getProfileData
} from "../../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import { Alert, Box, Chip, List, ListItem, ListItemIcon, ListItemText, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { makeStyles } from "@mui/styles";
import { deepPurple } from "@mui/material/colors";
import { Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import MovieIcon from "@mui/icons-material/Movie";
import DeleteIcon from "@mui/icons-material/Delete";
import Select from "react-select";
import { common } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";

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
  },
  selectWrapper: {
    marginBottom: "1.5rem"
  },
  mediaIcons: {
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: "1rem"
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(1),
    flexWrap: "wrap"
  }
}));

const MAX_MEDIA_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const NewTutorial = ({ viewModal, onSidebarClick }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");

  // Hidden file-input refs for the three media types
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [formValue, setformValue] = useState({
    title: "",
    summary: "",
    owner: "",
    tags: []
  });

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

  useEffect(() => {
    setTags([]);
    setNewTag("");
    setAttachedFiles([]);
    setUploadError("");
    setformValue({
      title: "",
      summary: "",
      owner: "",
      tags: []
    });
    setVisible(viewModal);
  }, [viewModal]);

  const handleFileSelect = e => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const valid = files.filter(f => {
      if (f.size > MAX_MEDIA_FILE_SIZE) {
        setUploadError(`"${f.name}" exceeds the 50 MB limit and was skipped.`);
        return false;
      }
      return true;
    });
    setAttachedFiles(prev => {
      const names = new Set(prev.map(f => f.name));
      return [...prev, ...valid.filter(f => !names.has(f.name))];
    });
    // Reset the input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleRemoveFile = filename => {
    setAttachedFiles(prev => prev.filter(f => f.name !== filename));
  };

  const getFileIcon = file => {
    if (file.type.startsWith("image/")) return <ImageIcon fontSize="small" />;
    if (file.type.startsWith("video/")) return <MovieIcon fontSize="small" />;
    return <DescriptionIcon fontSize="small" />;
  };

  const onSubmit = async () => {
    const tutorialData = {
      ...formValue,
      created_by: userHandle,
      is_org: userHandle !== formValue.owner,
      completed: false,
      media: []
    };

    // createTutorial navigates away on success; we pass attached files so
    // the action can upload them after the document is created.
    createTutorial(tutorialData, attachedFiles)(
      firebase,
      firestore,
      dispatch,
      history
    );
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCancel = () => {
    onSidebarClick();
    setTags([]);
    setNewTag("");
    setformValue({
      title: "",
      summary: "",
      owner: "",
      tags: []
    });
  };

  return (
    <Dialog
      open={visible}
      onClose={handleCancel}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="new-tutorial-dialog-title"
      data-testId="tutorialNewModal"
    >
      <DialogTitle id="new-tutorial-dialog-title">
        Create a Tutorial
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Tutorial creation failed. Please try again.
          </Alert>
        )}

        <Box className={classes.selectWrapper}>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
            Organization
          </Typography>
          <Select
            options={organizations?.map(org => ({
              value: org.org_handle,
              label: org.org_name
            }))}
            onChange={data => onOwnerChange(data.value)}
            id="orgSelect"
            placeholder="Select an organization…"
          />
        </Box>

        <form id="tutorialNewForm">
          <TextField
            label="Tutorial Title"
            placeholder="Enter a descriptive title"
            autoComplete="off"
            name="title"
            variant="outlined"
            fullWidth
            data-testId="newTutorial_title"
            id="newTutorialTitle"
            sx={{ mb: 2 }}
            onChange={handleChange}
          />

          <TextField
            label="Summary"
            placeholder="Brief description of this tutorial"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            name="summary"
            autoComplete="off"
            id="newTutorialSummary"
            data-testId="newTutorial_summary"
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <TextField
              label="Add a tag"
              variant="outlined"
              size="small"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="outlined" size="small" onClick={handleAddTag}>
              Add
            </Button>
          </Box>

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

          {/* Hidden file pickers */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <input
            ref={docInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          {uploadError && (
            <Alert severity="warning" sx={{ mb: 1 }} onClose={() => setUploadError("")}>
              {uploadError}
            </Alert>
          )}

          <Box className={classes.mediaIcons}>
            <Tooltip title="Attach image">
              <IconButton
                aria-label="attach image"
                size="small"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Attach video">
              <IconButton
                aria-label="attach video"
                size="small"
                onClick={() => videoInputRef.current?.click()}
              >
                <MovieIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Attach document">
              <IconButton
                aria-label="attach document"
                size="small"
                onClick={() => docInputRef.current?.click()}
              >
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {attachedFiles.length > 0 && (
            <List dense disablePadding>
              {attachedFiles.map(file => (
                <ListItem
                  key={file.name}
                  disableGutters
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label={`remove ${file.name}`}
                      size="small"
                      onClick={() => handleRemoveFile(file.name)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {getFileIcon(file)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ noWrap: true, variant: "body2" }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button id="cancelAddTutorial" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          data-testid="newTutorialSubmit"
          disabled={
            loading ||
            formValue.title === "" ||
            formValue.summary === "" ||
            formValue.owner === ""
          }
          sx={{
            bgcolor: "#03AAFA",
            borderRadius: "30px",
            color: common.white,
            "&:hover": { bgcolor: "#0390d4" }
          }}
        >
          {loading ? "Creating…" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewTutorial.propTypes = {
  viewModal: PropTypes.bool,
  onSidebarClick: PropTypes.func.isRequired,
  viewCallback: PropTypes.func,
  active: PropTypes.bool
};

export default NewTutorial;
