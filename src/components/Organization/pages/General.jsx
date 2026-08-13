import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  InputBase,
  Button,
  Fab,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { NoImage } from "../../../helpers/images";
import {
  uploadOrgProfileImage,
  clearEditGeneral,
  editGeneralData,
  getProfileData,
  deleteOrganization
} from "../../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useHistory } from "react-router-dom";
import ChangeProfile from "../../Profile/ChangeProfile/ChangeProfile";
import { useDebouncedEffect } from "../../../helpers/customHooks/useDebounce";
import useWindowSize from "../../../helpers/customHooks/useWindowSize";
import useOrgPermission from "../../../helpers/customHooks/useOrgPermission";
import RequiresRole from "../../../helpers/RequiresRole";

const useStyles = makeStyles(theme => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "10px",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    [theme.breakpoints.down("md")]: {
      width: "99%"
    },
    [theme.breakpoints.down("xs")]: {
      width: "99%"
    },
    marginTop: "20px"
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: 100
  },
  input: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: "10px",
    marginTop: "10px",
    width: "90%"
  },
  button: {
    boxShadow: "none",
    borderRadius: "25px",
    border: 0,
    backgroundColor: theme.palette.grey[200],
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`
  },
  hashbutton: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "10px",
    padding: 5,
    [theme.breakpoints.down("md")]: {
      width: "80%"
    },
    [theme.breakpoints.down("xs")]: {
      width: "99%"
    }
  },
  hashtag: {
    boxShadow: "none",
    borderRadius: "25px",
    border: 0,
    direction: "column",
    backgroundColor: theme.palette.grey[200],
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`
  },
  ProfilePhotoImage: {
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  ProfileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  LoadingData: {
    opacity: 0.5,
    fontStyle: "italic",
    fontSize: "0.8rem"
  },
  deleteSection: {
    border: `1px solid ${theme.palette.error.light}`,
    borderRadius: "10px",
    padding: 20,
    marginTop: "20px"
  }
}));

const base64StringToFile = (base64String, filename) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
};

/**
 * @description - This component is used to edit the general details of the organization.
 * @returns {React.Component}
 */
function General() {
  const classes = useStyles();
  // Firebase Hooks
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const windowSize = useWindowSize();
  const history = useHistory();

  const { level } = useOrgPermission();
  const isEditable = level >= 2;

  const CurrentOrg = useSelector(
    ({
      profile: { data: { organizations } },
      org: { general: { current } }
    }) => organizations.find(el => el.org_handle === current)
  );
  const profileOrganizations = useSelector(
    ({ profile: { data: { organizations } } }) => organizations
  );

  // Image Uploading And Cropping Hooks
  const [imageUploading, setImageUploading] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // State Hooks
  const [isUpdating, setIsUpdating] = useState(false);
  const [OrgData, setOrgData] = useState(CurrentOrg);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useDebouncedEffect(
    () => {
      if (isEditable) EditOrg();
    },
    [OrgData],
    2000
  );

  const handleChange = name => event => {
    if (!isEditable) return;
    setOrgData({ ...OrgData, [name]: event.target.value });
  };

  const saveImage = (canvas, crop) => {
    if (!crop || !canvas) return;
    setShowImageDialog(false);
    uploadImage(base64StringToFile(canvas.toDataURL(), "newfile"));
  };

  const uploadImage = file => {
    if (!isEditable) return;
    setIsUpdating(true);
    uploadOrgProfileImage(file, CurrentOrg.org_handle, CurrentOrg)(
      firebase,
      dispatch
    ).then(() => {
      setIsUpdating(false);
      setImageUploading(false);
      clearEditGeneral()(dispatch);
    });
  };

  const EditOrg = useCallback(() => {
    setIsUpdating(true);
    editGeneralData(
      { ...OrgData, org_handle: CurrentOrg.org_handle, org_image: CurrentOrg.org_image },
      profileOrganizations
    )(firebase, firestore, dispatch).then(() => {
      setIsUpdating(false);
    });
  }, [profileOrganizations, OrgData, dispatch, firebase, firestore, CurrentOrg]);

  useEffect(() => {
    if (!profileOrganizations) {
      getProfileData()(firebase, firestore, dispatch);
    }
  }, [firestore, firebase, dispatch, profileOrganizations]);

  const handleDeleteOrg = async () => {
    if (deleteConfirmText !== CurrentOrg.org_handle) return;
    setDeleteError("");
    try {
      await deleteOrganization(CurrentOrg.org_handle)(firebase, dispatch);
      setDeleteDialogOpen(false);
      history.push("/dashboard/my_feed");
    } catch (e) {
      setDeleteError(e.message || "Failed to delete organization.");
    }
  };

  if (!CurrentOrg) return null;

  return (
    <React.Fragment>
      <div data-testid="organization-general-page">
        {/* Heading + save indicator */}
        <Grid item container spacing={6} alignItems="center">
          <Grid item>
            <Typography className={classes.heading}>General</Typography>
          </Grid>
          <Grid item container xs={4} spacing={2}>
            {isUpdating ? (
              <React.Fragment>
                <Grid item>
                  <CircularProgress style={{ color: "black" }} size={16} className={classes.LoadingData} />
                </Grid>
                <Grid item>
                  <Typography className={classes.LoadingData}>Updating Info...</Typography>
                </Grid>
              </React.Fragment>
            ) : (
              <Grid item>
                <Typography className={classes.LoadingData}>Data Updated</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Read-only notice for viewers/editors */}
        {!isEditable && (
          <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
            You have read-only access to these settings.
          </Alert>
        )}

        {/* Fields */}
        <div className={classes.root}>
          <Grid item container spacing={2}>
            <Grid item xs={windowSize.width <= 500 ? 12 : 6}>
              <Typography>Organization Name</Typography>
              <InputBase
                className={classes.input}
                placeholder="Organization Name"
                value={OrgData.org_name || ""}
                onChange={handleChange("org_name")}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={windowSize.width <= 500 ? 12 : 6}>
              <Typography>Organization Handle</Typography>
              <InputBase
                className={classes.input}
                placeholder="Organization Handle"
                disabled
                value={OrgData.org_handle || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Website URL</Typography>
              <InputBase
                className={classes.input}
                placeholder="https://Website URL"
                value={OrgData.org_website || ""}
                onChange={handleChange("org_website")}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>FaceBook URL</Typography>
              <InputBase
                className={classes.input}
                placeholder="https://Facebook URL"
                value={OrgData.org_link_facebook || ""}
                onChange={handleChange("org_link_facebook")}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Github URL</Typography>
              <InputBase
                className={classes.input}
                placeholder="https://github.com/ Github Handle"
                value={OrgData.org_link_github || ""}
                onChange={handleChange("org_link_github")}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>LinkedIn URL</Typography>
              <InputBase
                className={classes.input}
                placeholder="https://LinkedIn URL"
                value={OrgData.org_link_linkedin || ""}
                onChange={handleChange("org_link_linkedin")}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Twitter URL</Typography>
              <InputBase
                className={classes.input}
                placeholder="https://Twitter URL"
                value={OrgData.org_link_twitter || ""}
                onChange={handleChange("org_link_twitter")}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>Profile Image</Typography>
              <Grid container direction="column">
                <Grid item container alignItems="center">
                  <Grid item xs={2} className={classes.ProfileContainer}>
                    {CurrentOrg.org_image ? (
                      <Avatar
                        src={CurrentOrg.org_image}
                        className={classes.ProfilePhotoImage}
                      />
                    ) : (
                      <img src={NoImage} alt="Not Available" />
                    )}
                  </Grid>

                  <Grid item>
                    {imageUploading ? (
                      <LinearProgress />
                    ) : (
                      isEditable && (
                        <Box mt={4} mb={6} m={0}>
                          <center>
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<CloudUploadIcon />}
                              onClick={() => setShowImageDialog(true)}
                            >
                              Choose File
                            </Button>
                          </center>
                        </Box>
                      )
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        {/* Description */}
        <div className={classes.root}>
          <Grid item xs={windowSize.width <= 500 ? 12 : 6}>
            <CardContent>
              <Typography>Brief description</Typography>
              <TextField
                id="outlined-multiline-flexible"
                multiline
                rows={4}
                fullWidth
                variant="filled"
                value={OrgData.org_description || ""}
                onChange={handleChange("org_description")}
                disabled={!isEditable}
              />
              <Typography sx={{ mt: 1 }}>Select tags</Typography>
              <Grid item xs={16} className={classes.hashbutton}>
                <Button className={classes.hashtag} disableRipple>#python</Button>
                <Button className={classes.hashtag} disableRipple>#javascript</Button>
                {isEditable && (
                  <Fab size="small" color="primary" aria-label="add">
                    <AddIcon />
                  </Fab>
                )}
              </Grid>
            </CardContent>
          </Grid>
        </div>

        {/* Delete section — owner only */}
        <RequiresRole minLevel={3}>
          <div className={classes.deleteSection}>
            <Typography variant="h6" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Permanently delete this organization. This action cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setDeleteConfirmText("");
                setDeleteError("");
                setDeleteDialogOpen(true);
              }}
              data-testid="delete-org-button"
            >
              Delete Organization
            </Button>
          </div>
        </RequiresRole>
      </div>

      {/* Image crop dialog */}
      <ChangeProfile
        saveImage={saveImage}
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-org-dialog-title"
      >
        <DialogTitle id="delete-org-dialog-title">Delete Organization</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This will permanently delete <strong>{CurrentOrg.org_handle}</strong> and remove
            all members. This action cannot be undone.
          </Typography>
          <Typography gutterBottom>
            Type <strong>{CurrentOrg.org_handle}</strong> to confirm:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            placeholder={CurrentOrg.org_handle}
            data-testid="delete-org-confirm-input"
          />
          {deleteError && (
            <Alert severity="error" sx={{ mt: 1 }}>{deleteError}</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteOrg}
            color="error"
            variant="contained"
            disabled={deleteConfirmText !== CurrentOrg.org_handle}
            data-testid="delete-org-confirm-button"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default General;
