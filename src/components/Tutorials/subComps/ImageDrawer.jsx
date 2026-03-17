import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTutorialImagesReducer,
  remoteTutorialImages,
  uploadTutorialImages
} from "../../../store/actions";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ImageDrawer = ({ onClose, visible, owner, tutorial_id, imageURLs }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const uploading = useSelector(
    ({
      tutorials: {
        images: { uploading }
      }
    }) => uploading
  );

  const progress = useSelector(
    ({
      tutorials: {
        images: { progress }
      }
    }) => progress || {}
  );

  const uploading_error = useSelector(
    ({
      tutorials: {
        images: { uploading_error }
      }
    }) => uploading_error
  );

  const deleting = useSelector(
    ({
      tutorials: {
        images: { deleting }
      }
    }) => deleting
  );

  const deleting_error = useSelector(
    ({
      tutorials: {
        images: { deleting_error }
      }
    }) => deleting_error
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ""
  });

  const [localUploads, setLocalUploads] = useState([]);

  const drawerPaperSx = useMemo(
    () => ({
      width: {
        xs: "80%",
        sm: "30%",
        md: "30%"
      },
      minWidth: { xs: "280px", sm: "350px" },
      maxWidth: "100vw"
    }),
    []
  );

  useEffect(() => {
    if (uploading === false && uploading_error === false && visible) {
      setSnackbar({
        open: true,
        message: "Uploads completed successfully."
      });
      setLocalUploads([]);
    } else if (uploading === false && uploading_error) {
      setSnackbar({
        open: true,
        message: uploading_error
      });
    }
  }, [uploading, uploading_error, visible]);

  useEffect(() => {
    if (deleting === false && deleting_error === false && visible) {
      setSnackbar({
        open: true,
        message: "Image deleted successfully."
      });
    } else if (deleting === false && deleting_error) {
      setSnackbar({
        open: true,
        message: deleting_error
      });
    }
  }, [deleting, deleting_error, visible]);

  useEffect(() => {
    clearTutorialImagesReducer()(dispatch);
    return () => {
      clearTutorialImagesReducer()(dispatch);
    };
  }, [dispatch]);

  const validateAndUpload = files => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const newUploads = fileArray.map(file => {
      let error = null;
      if (file.size > 10 * 1024 * 1024) error = "File exceeds 10MB limit";

      const allowedTypes = ["image/", "video/", "application/pdf"];
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        error = "Only images, videos and PDFs supported";
      }

      return {
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
        type: file.type,
        error
      };
    });

    setLocalUploads(prev => [...prev, ...newUploads]);

    const validFiles = newUploads.filter(f => !f.error).map(f => f.file);
    if (validFiles.length > 0) {
      uploadTutorialImages(owner, tutorial_id, validFiles)(
        firebase,
        firestore,
        dispatch
      );
    }
  };

  const deleteFile = item =>
    remoteTutorialImages(owner, tutorial_id, item)(
      firebase,
      firestore,
      dispatch
    );

  const setAsFeatured = async url => {
    try {
      await firestore.collection("tutorials").doc(tutorial_id).update({
        featured_image: url,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
      setSnackbar({
        open: true,
        message: "Featured image updated."
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to set featured image."
      });
    }
  };

  const FileIcon = ({ type }) => {
    if (type.startsWith("image/")) return null;
    if (type.includes("pdf"))
      return <PictureAsPdfIcon sx={{ fontSize: 40, color: "#f44336" }} />;
    if (type.startsWith("video/"))
      return <VideoLibraryIcon sx={{ fontSize: 40, color: "#2196f3" }} />;
    return <InsertDriveFileIcon sx={{ fontSize: 40, color: "#9e9e9e" }} />;
  };

  return (
    <>
      <Drawer
        data-testid="imageDrawer"
        anchor="right"
        onClose={onClose}
        open={visible}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: drawerPaperSx }}
      >
        <Box
          className="col-pad-24"
          data-testId="tutorialImgUpload"
          sx={{ py: 2, height: "100%", overflowY: "auto" }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Manage Media
          </Typography>

          <Box
            component="label"
            htmlFor="file-upload"
            onDragOver={event => event.preventDefault()}
            onDrop={event => {
              event.preventDefault();
              validateAndUpload(event.dataTransfer.files);
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #2894ff",
              borderRadius: "4px",
              cursor: "pointer",
              py: 3,
              px: 2,
              color: "#2894ff",
              textAlign: "center",
              mb: 2,
              transition: "background 0.3s",
              "&:hover": { background: "rgba(40, 148, 255, 0.05)" }
            }}
          >
            <input
              id="file-upload"
              accept="image/*,video/*,application/pdf"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={event => {
                validateAndUpload(event.target.files);
                event.target.value = "";
              }}
            />
            <Typography component="div" sx={{ fontSize: "2rem", mb: 1 }}>
              <InboxOutlined />
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>
              Drop files here or click to upload
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", mt: 1 }}
            >
              Max 10MB per file (Images, Videos, PDFs)
            </Typography>
          </Box>

          {localUploads.map((up, idx) => {
            const fileProgress = progress[up.name] || 0;
            const isDone = fileProgress === 100;

            return (
              <Box
                key={idx}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: "8px"
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  {up.preview ? (
                    <Box
                      component="img"
                      src={up.preview}
                      sx={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: "4px"
                      }}
                    />
                  ) : (
                    <FileIcon type={up.type} />
                  )}
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                      {up.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {up.size}
                    </Typography>
                  </Box>
                  {isDone ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : up.error ? (
                    <ErrorIcon color="error" fontSize="small" />
                  ) : (
                    <LoadingOutlined style={{ color: "#2894ff" }} />
                  )}
                </Box>

                {up.error ? (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {up.error}
                  </Typography>
                ) : (
                  !isDone && (
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={fileProgress}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ mt: 0.5, display: "block", textAlign: "right" }}
                      >
                        Uploading... {Math.round(fileProgress)}%
                      </Typography>
                    </Box>
                  )
                )}
                {isDone && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    Upload complete
                  </Typography>
                )}
              </Box>
            );
          })}

          <Typography variant="subtitle2" sx={{ mt: 4, mb: 1, opacity: 0.7 }}>
            Uploaded Media ({imageURLs?.length || 0})
          </Typography>

          {imageURLs &&
            imageURLs.length > 0 &&
            imageURLs.map((image, i) => {
              const url =
                typeof image === "string"
                  ? image
                  : image?.url || image?.downloadURL;
              const name =
                typeof image === "string" ? "Image" : image?.name || "Image";
              const type = image?.type || "image/png";
              if (!url) return null;

              return (
                <Grid
                  key={i}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    p: 1.5,
                    mt: 1.5,
                    flexWrap: "nowrap"
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f9f9f9",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}
                  >
                    {type.startsWith("image/") ? (
                      <Box
                        component="img"
                        src={url}
                        alt={name}
                        onError={e => {
                          e.target.src =
                            "https://via.placeholder.com/60?text=File";
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <FileIcon type={type} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <CopyToClipboard
                        text={
                          type.startsWith("image/")
                            ? `![alt=image; scale=1.0](${url})`
                            : `[${name}](${url})`
                        }
                        onCopy={() =>
                          setSnackbar({ open: true, message: "Copied Link." })
                        }
                      >
                        <Button size="small" sx={{ fontSize: "0.65rem", p: 0 }}>
                          COPY LINK
                        </Button>
                      </CopyToClipboard>
                      <Button
                        size="small"
                        color="error"
                        disabled={deleting}
                        onClick={() => deleteFile(image)}
                        sx={{ fontSize: "0.65rem", p: 0 }}
                      >
                        DELETE
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
        </Box>
      </Drawer>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </>
  );
};

export default ImageDrawer;
