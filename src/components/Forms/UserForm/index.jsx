import React, { useEffect, useState } from "react";
import {
  Card,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Box,
  Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserProfile,
  getUserProfileData,
  updateUserProfile
} from "../../../store/actions";
import countryList from "../../../helpers/countryList";
import {
  validateCountry,
  validateIsEmpty,
  validateName,
  validateOrgWebsite
} from "../../../helpers/validations";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const UserForm = () => {
  const { handle } = useParams();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const profileData = useSelector(({ firebase: { profile } }) => profile);

  const getData = (prop) => (Boolean(prop) ? prop : "");

  const [name, setName] = useState(getData(profileData.displayName));
  const [nameValidateError, setNameValidateError] = useState(false);
  const [nameValidateErrorMessage, setNameValidateErrorMessage] = useState("");

  const [country, setCountry] = useState(getData(profileData.country));
  const [countryValidateError, setCountryValidateError] = useState(false);

  const [website, setWebsite] = useState(getData(profileData.website));
  const [websiteValidateError, setWebsiteValidateError] = useState(false);
  const [websiteValidateErrorMessage, setWebsiteValidateErrorMessage] = useState("");

  const [description, setDescription] = useState(getData(profileData.description));
  const [descriptionValidateError, setDescriptionValidateError] = useState(false);
  const [descriptionValidateErrorMessage, setDescriptionValidateErrorMessage] = useState("");

  const [facebook, setFacebook] = useState(getData(profileData.link_facebook));
  const [twitter, setTwitter] = useState(getData(profileData.link_twitter));
  const [linkedin, setLinkedin] = useState(getData(profileData.link_linkedin));
  const [github, setGithub] = useState(getData(profileData.link_github));

  const validated = () => {
    const countryValid = validateCountry(country, setCountryValidateError);
    const orgWebsiteValid = validateOrgWebsite(
      website,
      setWebsiteValidateError,
      setWebsiteValidateErrorMessage
    );
    const nameValid = validateName(
      name,
      setNameValidateError,
      setNameValidateErrorMessage,
      "Please enter your name",
      "Please enter a real name"
    );
    const descriptionValid = validateIsEmpty(
      description,
      setDescriptionValidateError,
      setDescriptionValidateErrorMessage,
      "Please enter a description"
    );
    return nameValid && countryValid && orgWebsiteValid && descriptionValid;
  };

  const onSubmit = () => {
    if (validated()) {
      updateUserProfile({
        displayName: name,
        website,
        link_facebook: facebook,
        link_github: github,
        link_linkedin: linkedin,
        link_twitter: twitter,
        description,
        country
      })(firebase, firestore, dispatch);
    }
  };

  const loadingProps = useSelector(({ profile: { edit: { loading } } }) => loading);
  useEffect(() => {
    setLoading(loadingProps);
  }, [loadingProps]);

  useEffect(() => {
    getUserProfileData(handle)(firebase, firestore, dispatch);
    return () => {
      clearUserProfile()(dispatch);
    };
  }, [firebase, firestore, dispatch, handle]);

  const countryOptions = countryList.map((c) => (
    <MenuItem key={c.code} value={c.name} data-testId="selectCountryItem">
      {c.name}
    </MenuItem>
  ));

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        mx: "auto",
        mt: -3,
        transform: 'translateY(-20px)',
      }}
      data-testId="profilePage"
    >
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameValidateError}
          helperText={nameValidateError && nameValidateErrorMessage}
          data-testId="name"
        />

        <TextField
          select
          label="Country of residence"
          variant="outlined"
          fullWidth
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          error={countryValidateError}
          data-testId="selectCountry"
        >
          {countryOptions}
        </TextField>

        <TextField
          label="Enter Website name"
          variant="outlined"
          fullWidth
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          error={websiteValidateError}
          helperText={websiteValidateError && websiteValidateErrorMessage}
          data-testId="website"
        />

        <TextField
          label="Describe Yourself"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={descriptionValidateError}
          helperText={descriptionValidateError && descriptionValidateErrorMessage}
          data-testId="description"
        />

        <TextField
          label="Facebook"
          variant="outlined"
          placeholder="username"
          fullWidth
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          data-testId="editProfileFacebook"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ pr: 0.5 }}>
                <FacebookIcon sx={{ color: "#1877F2" }} />
                <Typography sx={{ ml: 1, color: "grey.800" }}>facebook.com/</Typography>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Twitter"
          variant="outlined"
          placeholder="username"
          fullWidth
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          data-testId="editProfileTwitter"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ pr: 0.5 }}>
                <TwitterIcon sx={{ color: "#1DA1F2" }} />
                <Typography sx={{ ml: 1, color: "grey.800" }}>twitter.com/</Typography>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="LinkedIn"
          variant="outlined"
          placeholder="username"
          fullWidth
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          data-testId="editProfileLinkedin"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ pr: 0.5 }}>
                <LinkedInIcon sx={{ color: "#0077B5" }} />
                <Typography sx={{ ml: 1, color: "grey.800" }}>linkedin.com/in/</Typography>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="GitHub"
          variant="outlined"
          placeholder="username"
          fullWidth
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          data-testId="editProfileGithub"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ pr: 0.5 }}>
                <GitHubIcon sx={{ color: "#000000" }} />
                <Typography sx={{ ml: 1, color: "grey.800" }}>github.com/</Typography>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          size="small"
          variant="contained"
          sx={{ backgroundColor: "SeaGreen", mt: 2 }}
          data-testId="editProfileSave"
          onClick={onSubmit}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Card>
  );
};

export default UserForm;
