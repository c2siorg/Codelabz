import React, { useEffect, useState } from "react";
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
  closeButton : {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    background: "#9a999910"
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
  const [showImage, setShowImage] = useState(false)
  const [largeImage, setLargeImage] = useState(false)
  const [formValue, setformValue] = useState({
    title: "",
    summary: "",
    owner: "",
    featured_image : null,
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


  const profileState = useSelector(state => state.profile.data);
  
const { organizations, isEmpty } = profileState || { organizations: null, isEmpty: false };

useEffect(() => {
  const isFetchProfile = organizations === null && !isEmpty;
  
  if (isFetchProfile) {
    getProfileData()(firebase, firestore, dispatch);
  }
}, [firestore, firebase, dispatch, organizations, isEmpty]);

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
      owner: "",
      tags: []
    });
    setVisible(viewModal);
  }, [viewModal]);

  const onSubmit = formData => {
    formData.preventDefault();
    const tutorialData = {
      ...formValue,
      created_by: userHandle,
      is_org: userHandle !== formValue.owner,
      completed: false
    };
    console.log(tutorialData);
    createTutorial(tutorialData)(firebase, firestore, dispatch, history);
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

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0]
    setformValue(prev => ({
      ...prev,
      featured_image : imageFile
    }))
  }

  const handleRemoveImage = () => {
    setformValue(prev => ({
      ...prev,
      featured_image : null
    }))
  }

  const toggleShowImage = () => {
    setShowImage(!showImage)
  }

  const handleAvatarClick = () => {
    setLargeImage(URL.createObjectURL(formValue.featured_image))
    toggleShowImage();
  }

  const classes = useStyles();
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
          width: "auto",
          background: "white",
          padding: "2rem",
          paddingTop: "1rem",
          maxWidth: "40%"
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
              options={organizations?.map(org => ({
                value: org.org_handle,
                label: org.org_name
              }))}
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

          <IconButton
            component = "label"
            htmlFor="fileInput"
            title="Upload Tutorial Image"
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={e=>handleImageChange(e)}
              disableUnderline
              style={{display : "none"}}
              />
            <ImageIcon />
          </IconButton>
          <IconButton>
            <MovieIcon />
          </IconButton>
          <IconButton>
            <DescriptionIcon />
          </IconButton>

          {formValue.featured_image && (
            <div>
              <div
                style={{
                  position : "relative",
                  marginTop : "1.5rem",
                  display : "inline-block"
                }}
                >
                  <Avatar 
                  src={URL.createObjectURL(formValue.featured_image)} 
                  sx={{
                    width: 60,
                    height: 60,
                    border: "0.8px solid #ccc",
                    cursor: "pointer"
                  }}
                  title="Tutorial Image"
                  onClick={handleAvatarClick} 
                  />
                  <IconButton
                    className={classes.closeButton}
                    onClick={handleRemoveImage}
                    title="Remove Image"
                  >
                    <CloseIcon sx={{color : "#000", fontSize : 16}}/>
                  </IconButton>
                </div>
            </div>)}

            {showImage && (
              <Modal 
                open={showImage}
                onClose={toggleShowImage}
                aria-labelledby="view-tutorial-image"
                aria-describedby="view-tutorial-image-by-clicking-on-the-avatar"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                >
                  <div
                    style={{
                      background: "white",
                      width: "auto",
                      height: "80%"
                    }}
                  >
                    <img
                      src={largeImage}
                      alt="Large Tutorial Image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                </Modal>
            )}
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
                    owner: "",
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
                  formValue.owner === ""
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
