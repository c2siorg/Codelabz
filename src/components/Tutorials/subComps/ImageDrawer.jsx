import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTutorialImagesReducer,
  remoteTutorialImages,
  uploadTutorialImages
} from "../../../store/actions";

const ImageDrawer = ({ onClose, visible, owner, tutorial_id, imageURLs }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const [uploadingMediaKind, setUploadingMediaKind] = useState("image");

  const uploading = useSelector(
    ({
      tutorials: {
        images: { uploading }
      }
    }) => uploading
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

  useEffect(() => {
    if (uploading === false && uploading_error === false) {
      // Preserve existing behavior (no-op Snackbar side effect)
    } else if (uploading === false && uploading_error) {
      // Preserve existing behavior (no-op Snackbar side effect)
    }
  }, [uploading, uploading_error]);

  useEffect(() => {
    if (deleting === false && deleting_error === false) {
      // Preserve existing behavior (no-op Snackbar side effect)
    } else if (deleting === false && deleting_error) {
      // Preserve existing behavior (no-op Snackbar side effect)
    }
  }, [deleting, deleting_error]);

  useEffect(() => {
    clearTutorialImagesReducer()(dispatch);
    return () => {
      clearTutorialImagesReducer()(dispatch);
    };
  }, [dispatch]);

  const handleFileChange = e => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    const hasVideo = files.some(
      currentFile => currentFile.type && currentFile.type.startsWith("video/")
    );
    setUploadingMediaKind(hasVideo ? "video" : "image");

    uploadTutorialImages(owner, tutorial_id, files)(
      firebase,
      firestore,
      dispatch
    );

    e.target.value = "";
  };

  const deleteFile = (name, url) =>
    remoteTutorialImages(
      owner,
      tutorial_id,
      name,
      url
    )(firebase, firestore, dispatch);

  return (
    <Drawer
      title="Images"
      data-testid="imageDrawer"
      anchor="right"
      closable={true}
      onClose={onClose}
      open={visible}
      getContainer={true}
      style={{ position: "absolute" }}
      width="400px"
      className="image-drawer"
      destroyOnClose={true}
      maskClosable={false}
    >
      <div className="col-pad-24" data-testId="tutorialImgUpload">
        <Grid>
          <input
            id="file-upload"
            fullWidth
            accept="image/*,video/*"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {uploading ? (
            <>
              <LoadingOutlined /> Please wait...
              <p className="ant-upload-hint mt-8">
                {uploadingMediaKind === "video"
                  ? "Uploading video(s)..."
                  : "Uploading image(s)..."}
              </p>
            </>
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag images/videos here to upload
              </p>
            </>
          )}
        </Grid>
        {imageURLs &&
          imageURLs.length > 0 &&
          imageURLs.map((image, i) => (
            <Grid className="mb-24" key={i}>
              <Grid xs={24} md={8}>
                {image?.type && image.type.startsWith("video/") ? (
                  <video
                    src={image.url}
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "150px",
                      objectFit: "cover",
                      marginBottom: "8px"
                    }}
                  />
                ) : (
                  <img
                    src={image.url}
                    alt={image.name}
                    style={{
                      width: "100%",
                      maxHeight: "150px",
                      objectFit: "cover",
                      marginBottom: "8px"
                    }}
                  />
                )}
              </Grid>
              <Grid xs={24} md={16} className="pl-8" style={{}}>
                <h4 className="pb-8">{image.name}</h4>
              </Grid>
            </Grid>
          ))}
      </div>
    </Drawer>
  );
};

export default ImageDrawer;
