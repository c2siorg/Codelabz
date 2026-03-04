import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  InputAdornment,
  CircularProgress
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
    borderRadius: "5px",
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#f3f3f3" : "#fff",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "100%",
    padding: "8px 6px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow"
    ]),
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      backgroundColor: "#fcfcfc"
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
  const [saved, setSaved] = useState(null);

  const getData = prop => prop ?? "";
  const profileData = useSelector(({ firebase: { profile } }) => profile);

  const [form, setForm] = useState({
    name: getData(profileData.displayName),
    country: getData(profileData.country),
    website: getData(profileData.website),
    description: getData(profileData.description),
    facebook: getData(profileData.link_facebook),
    twitter: getData(profileData.link_twitter),
    linkedin: getData(profileData.link_linkedin),
    github: getData(profileData.link_github)
  });

  const [errors, setErrors] = useState({
    name: { error: false, message: "" },
    country: { error: false, message: "" },
    website: { error: false, message: "" },
    description: { error: false, message: "" }
  });

  const handleChange = useCallback(
    field => e => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => ({ ...prev, [field]: { error: false, message: "" } }));
    },
    []
  );

  const countryOptions = useMemo(
    () =>
      countryList.map(({ code, name }) => (
        <MenuItem key={code} value={name} data-testId="selectCountryItem">
          {name}
        </MenuItem>
      )),
    []
  );

  const validated = () => {
    const nameValid = validateName(
      form.name,
      val =>
        setErrors(prev => ({ ...prev, name: { ...prev.name, error: val } })),
      val =>
        setErrors(prev => ({ ...prev, name: { ...prev.name, message: val } })),
      "Please enter your name",
      "Please enter a real name"
    );
    const countryValid = validateCountry(form.country, val =>
      setErrors(prev => ({ ...prev, country: { ...prev.country, error: val } }))
    );
    const orgWebsiteValid = validateOrgWebsite(
      form.website,
      val =>
        setErrors(prev => ({
          ...prev,
          website: { ...prev.website, error: val }
        })),
      val =>
        setErrors(prev => ({
          ...prev,
          website: { ...prev.website, message: val }
        }))
    );
    const descriptionValid = validateIsEmpty(
      form.description,
      val =>
        setErrors(prev => ({
          ...prev,
          description: { ...prev.description, error: val }
        })),
      val =>
        setErrors(prev => ({
          ...prev,
          description: { ...prev.description, message: val }
        })),
      "Please enter a description"
    );
    return nameValid && countryValid && orgWebsiteValid && descriptionValid;
  };

  const onSubmit = () => {
    if (validated()) {
      updateUserProfile({
        displayName: form.name,
        website: form.website,
        link_facebook: form.facebook,
        link_github: form.github,
        link_linkedin: form.linkedin,
        link_twitter: form.twitter,
        description: form.description,
        country: form.country
      })(firebase, firestore, dispatch);
      setSaved(true);
    } else {
      setSaved(false);
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

  useEffect(() => {
    if (saved !== null) {
      const timer = setTimeout(() => setSaved(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [saved])

  return (
    <Card className={classes.root} data-testId="profilePage">
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <FormControl
            variant="standard"
            style={{ marginRight: 25, marginTop: 20 }}
          >
            <InputLabel
              shrink
              htmlFor="bootstrap-input"
              style={{ color: "#000", fontSize: "20px" }}
              error={errors.name.error}
              sx={{
                width: "250px"
              }}
            >
              Name
            </InputLabel>
            <Input
              value={form.name}
              id="bootstrap-input"
              className={classes.input}
              placeholder="John Doe"
              data-testId="name"
              onChange={handleChange("name")}
            />
            <Typography className={classes.errorMessage}>
              {errors.name.message}
            </Typography>
          </FormControl>
          <Box
            variant="standard"
            style={{
              display: "inline-flex",
              flexDirection: "column",
              marginTop: 20
            }}
          >
            <InputLabel
              shrink
              htmlFor="bootstrap-input"
              style={{ color: "#000", fontSize: "20px" }}
              error={errors.country.error}
            >
              Country of residence
            </InputLabel>
            <Select
              value={form.country}
              onChange={handleChange("country")}
              displayEmpty
              sx={{
                width: "288px",
                height: "56px",
                marginTop: "-5px"
              }}
              inputProps={{ "aria-label": "Without label" }}
            >
              {countryOptions}
            </Select>
          </Box>
        </Box>
        <Box>
          <FormControl
            variant="standard"
            style={{ marginTop: "15px", marginRight: "25px" }}
          >
            <InputLabel
              shrink
              htmlFor="bootstrap-input"
              style={{ color: "#000", fontSize: "20px" }}
              sx={{
                width: "250px"
              }}
            >
              Website
            </InputLabel>
            <Input
              value={form.website}
              id="bootstrap-input"
              className={classes.input}
              placeholder="https://CodeLabz.com"
              data-testId="website"
              onChange={handleChange("website")}
            />
            <Typography className={classes.errorMessage}>
              {errors.website.message}
            </Typography>
          </FormControl>
          <FormControl variant="standard" style={{ marginTop: "15px" }}>
            <InputLabel
              shrink
              htmlFor="bootstrap-input"
              sx={{
                width: "250px"
              }}
              style={{ color: "#000", fontSize: "20px" }}
            >
              Description
            </InputLabel>
            <Input
              value={form.description}
              id="bootstrap-input"
              className={classes.input}
              placeholder="Tell us about yourself"
              data-testId="description"
              onChange={handleChange("description")}
            />
            <Typography className={classes.errorMessage}>
              {errors.description.message}
            </Typography>
          </FormControl>
        </Box>
        <Box style={{ marginTop: 30, width: "100%", maxWidth: 600 }}>
          <TextField
            label="Facebook"
            variant="outlined"
            placeholder="username"
            value={form.facebook}
            data-testId="editProfileFacebook"
            onChange={handleChange("facebook")}
            autoComplete="handle"
            style={{ marginBottom: "15px" }}
            sx={{
              width: "100%",
              maxWidth: "600px"
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ padding: "25px 0" }}>
                  <FacebookIcon className={classes.fb} />
                  <p style={{ margin: "15px 0px 15px 8px", color: "#555" }}>
                    facebook.com/
                  </p>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box style={{ marginTop: 15, width: "100%", maxWidth: 600 }}>
          <TextField
            label="Twitter"
            variant="outlined"
            value={form.twitter}
            placeholder="username"
            data-testId="editProfileTwitter"
            onChange={handleChange("twitter")}
            autoComplete="handle"
            style={{ marginBottom: "15px" }}
            sx={{
              width: "100%",
              maxWidth: "600px"
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ padding: "25px 0" }}>
                  <TwitterIcon className={classes.tw} />
                  <p style={{ margin: "15px 0px 15px 8px", color: "#555" }}>
                    twitter.com/
                  </p>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box style={{ marginTop: 15, width: "100%", maxWidth: 600 }}>
          <TextField
            label="LinkedIn"
            variant="outlined"
            value={form.linkedin}
            data-testId="editProfileLinkedin"
            placeholder="username"
            onChange={handleChange("linkedin")}
            autoComplete="handle"
            style={{ marginBottom: "15px" }}
            sx={{
              width: "100%",
              maxWidth: "600px"
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ padding: "25px 0" }}>
                  <LinkedInIcon className={classes.li} />
                  <p style={{ margin: "15px 0px 15px 8px", color: "#555" }}>
                    linkedin.com/in/
                  </p>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box style={{ marginTop: 15, width: "100%", maxWidth: 600 }}>
          <TextField
            label="GitHub"
            variant="outlined"
            value={form.github}
            placeholder="username"
            onChange={handleChange("github")}
            data-testId="editProfileGithub"
            autoComplete="handle"
            style={{ marginBottom: "15px" }}
            sx={{
              width: "100%"
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ padding: "25px 0" }}>
                  <GitHubIcon className={classes.git} />
                  <p style={{ margin: "15px 0px 15px 8px", color: "#555" }}>
                    github.com/
                  </p>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Button
          size="large"
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#1DB954",
            marginTop: 15
          }}
          sx={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "5px",
            boxShadow: "none",
            transition: "all ease-in 200ms",
            "&:hover": {
              backgroundColor: "#18a84a !important",
              boxShadow: "0px 4px 12px rgba(46,139,87,0.4) !important",
              transform: "translateY(-1px)"
            }
          }}
          data-testId="editProfileSave"
          onClick={onSubmit}
        >
          {loading ? (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Saving...</span>
            </div>
          ) : "Save"}
        </Button>
        {saved !== null && (
          <Typography className="saveTxt">
            {saved? "Your information has been saved successfully!":"Something went wrong!"}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default UserForm;
