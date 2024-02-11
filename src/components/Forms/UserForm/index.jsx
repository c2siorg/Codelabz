import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  alpha,
  styled,
  Card,
  InputBase,
  InputLabel,
  TextField,
  FormControl,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  Button,
  InputAdornment
} from "@mui/material";
import useStyles from "./styles";
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

const Input = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3)
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#fff",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow"
    ]),    
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main
    }
  }
}));

const UserForm = () => {
  const classes = useStyles();

  const { handle } = useParams();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getData = prop => (Boolean(prop) ? prop : "");
  const profileData = useSelector(({ firebase: { profile } }) => profile);
  const [name, setName] = useState(getData(profileData.displayName));
  const [nameValidateError, setNameValidateError] = useState(false);
  const [nameValidateErrorMessage, setNameValidateErrorMessage] = useState("");
  const [country, setCountry] = useState(getData(profileData.country));
  const [countryValidateError, setCountryValidateError] = useState(false);
  const [website, setWebsite] = useState(getData(profileData.website));
  const [websiteValidateError, setWebsiteValidateError] = useState(false);
  const [websiteValidateErrorMessage, setWebsiteValidateErrorMessage] =
    useState("");
  const [description, setDescription] = useState(
    getData(profileData.description)
  );
  const [descriptionValidateError, setDescriptionValidateError] =
    useState(false);
  const [descriptionValidateErrorMessage, setDescriptionValidateErrorMessage] =
    useState("");
  const [facebook, setFacebook] = useState(getData(profileData.link_facebook));
  const [facebookValidateError, setFacebookValidateError] = useState(false);
  const [facebookValidateErrorMessage, setFacebookValidateErrorMessage] =
    useState("");
  const [twitter, setTwitter] = useState(getData(profileData.link_twitter));
  const [twitterValidateError, setTwitterValidateError] = useState(false);
  const [twitterValidateErrorMessage, setTwitterValidateErrorMessage] =
    useState("");
  const [linkedin, setLinkedin] = useState(getData(profileData.link_linkedin));
  const [linkedinValidateError, setLinkedinValidateError] = useState(false);
  const [linkedinValidateErrorMessage, setLinkedinValidateErrorMessage] =
    useState("");
  const [github, setGithub] = useState(getData(profileData.link_github));
  const [githubValidateError, setGithubValidateError] = useState(false);
  const [githubValidateErrorMessage, setGithubValidateErrorMessage] =
    useState("");
  const [organization, setOrganization] = useState(getData(profileData.organizations));
  const [organizationArray, setOrganizationArray] = useState([]);

  const children = [];
  for (let i = 0; i < countryList.length; i++) {
    children.push(
      <MenuItem
        key={countryList[i].code}
        value={countryList[i].name}
        data-testId="selectCountryItem"
      >
        {countryList[i].name}
      </MenuItem>
    );
  }

  const onChangeName = name => setName(name);
  const onChangeCountry = country => setCountry(country);
  const onChangeOrgWebsite = website => setWebsite(website);
  const onChangeDescription = description => setDescription(description);
  const onChangeFacebook = facebook => setFacebook(facebook);
  const onChangeTwitter = twitter => setTwitter(twitter);
  const onChangeLinkedin = linkedin => setLinkedin(linkedin);
  const onChangeGithub = github => setGithub(github);
  const onChangeOrganization = organization => setOrganization(organization);

  const addOrganizationInput = () => {
    if(organization.length != 0){
      const newOrganizationArray = [...organizationArray, organization];
      setOrganizationArray(newOrganizationArray);
      setOrganization("");
    }
  };

  const removeOrganizationInput = index => {
    const newOrganizationArray = [...organizationArray];
    newOrganizationArray.splice(index, 1);
    setOrganizationArray(newOrganizationArray);
  };

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

    if (nameValid && countryValid && orgWebsiteValid && descriptionValid) {
      return true;
    } else {
      return false;
    }
  };


  const onSubmit = (e) => {
    const newOrganizationArray = organizationArray.flat().filter(item => item !== undefined);

    if (validated()) {
      const userData = {
        displayName: name,
        website,
        link_facebook: facebook,
        link_github: github,
        link_linkedin: linkedin,
        link_twitter: twitter,
        description,
        country,
        organizations: newOrganizationArray
      };
      updateUserProfile(userData)(firebase, firestore, dispatch);
    }
  };

  const loadingProps = useSelector(
    ({
      profile: {
        edit: { loading }
      }
    }) => loading
  );

  useEffect(() => {
    setLoading(loadingProps);
  }, [loadingProps]);

  useEffect(() => {
    getUserProfileData(handle)(firebase, firestore, dispatch);
    return () => {
      clearUserProfile()(dispatch);
    };
  }, [firebase, firestore, dispatch, handle]);

  return (
    <Card className={classes.root} data-testId="profilePage">
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "20px"
        }}
      >
        <Box sx={{ display: 'flex', gap: '15px', width: '100%' }}>
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel htmlFor="name-input">Name</InputLabel>
            <OutlinedInput
              id="name-input"
              value={name}
              onChange={event => onChangeName(event.target.value)}
              label="Name"
            />
            <Typography className={classes.errorMessage}>
              {nameValidateErrorMessage}
            </Typography>
          </FormControl>
  
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel htmlFor="country-select">Country of residence</InputLabel>
            <Select
              value={country}
              onChange={event => onChangeCountry(event.target.value)}
              label="Country of residence"
              inputProps={{ id: 'country-select' }}
            >
              {countryList.map(country => (
                <MenuItem key={country.code} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
  
        <Box sx={{ display: 'flex', gap: '15px', width: '100%' }}>
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel htmlFor="website-input">Website</InputLabel>
            <OutlinedInput
              id="website-input"
              value={website}
              onChange={event => onChangeOrgWebsite(event.target.value)}
              label="Website"
            />
            <Typography className={classes.errorMessage}>
              {websiteValidateErrorMessage}
            </Typography>
          </FormControl>
  
          <FormControl variant="outlined" sx={{ width: '50%' }}>
            <InputLabel htmlFor="description-input">Description</InputLabel>
            <OutlinedInput
              id="description-input"
              value={description}
              onChange={event => onChangeDescription(event.target.value)}
              label="Description"
            />
            <Typography className={classes.errorMessage}>
              {descriptionValidateErrorMessage}
            </Typography>
          </FormControl>
        </Box>
  
        <TextField
          label="Facebook"
          variant="outlined"
          placeholder="username"
          value={facebook}
          onChange={event => onChangeFacebook(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FacebookIcon />
              </InputAdornment>
            ),
            style: { marginTop: "15px" }
          }}
        />
  
        <TextField
          label="Twitter"
          variant="outlined"
          placeholder="username"
          value={twitter}
          onChange={event => onChangeTwitter(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TwitterIcon />
              </InputAdornment>
            ),
            style: { marginTop: "15px" }
          }}
        />
  
        <TextField
          label="LinkedIn"
          variant="outlined"
          placeholder="username"
          value={linkedin}
          onChange={event => onChangeLinkedin(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkedInIcon />
              </InputAdornment>
            ),
            style: { marginTop: "15px" }
          }}
        />
  
        <TextField
          label="GitHub"
          variant="outlined"
          placeholder="username"
          value={github}
          onChange={event => onChangeGithub(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GitHubIcon />
              </InputAdornment>
            ),
            style: { marginTop: "15px" }
          }}
        />

        <FormControl variant="outlined" >
          <InputLabel htmlFor="organization-input">Organization</InputLabel>
          <OutlinedInput
            id="organization-input"
            value={organization}
            onChange={event => onChangeOrganization(event.target.value)}
            label="Organization"
          />
          <Button
            onClick={addOrganizationInput}
            variant="outlined"
            color="primary"
            style={{ marginTop: "15px" }}
          >
            Add Organization
          </Button>
        </FormControl>

        {organizationArray.map((org, index) => (
          <div key={index}>
            <FormControl variant="outlined" >
              <OutlinedInput
                value={org}
                readOnly
                endAdornment={
                  <InputAdornment position="end">
                    <Button onClick={() => removeOrganizationInput(index)}>Remove</Button>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
        ))}
  
        <Button
          fullWidth
          size="small"
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "SeaGreen",
            padding: "10px",
            font:"18px",
            fontWeight:"600"
          }}
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
