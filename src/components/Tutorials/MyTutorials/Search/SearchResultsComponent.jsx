import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import TutorialCard from "../BaseTutorialsComponent/TutorialCard";
import { searchFromTutorialsIndex } from "../../../../store/actions";
import { getTutorialFeedData } from "../../../../store/actions/tutorialPageActions";
import CardWithPicture from "../../../Card/CardWithPicture";
import CardWithoutPicture from "../../../Card/CardWithoutPicture";

const SearchResultsComponent = ({ results: propResults }) => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const tutorials = useSelector(
    ({
      tutorialPage: {
        feed: { homepageFeedArray }
      }
    }) => homepageFeedArray
  );

  useEffect(() => {
    setResults(tutorials);
  }, [tutorials]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    let tutorialIdArray = propResults || [];

    if (query) {
      tutorialIdArray = searchFromTutorialsIndex(query);
      tutorialIdArray = tutorialIdArray.map(tutorial => tutorial.ref);
    }

    const getResults = async () => {
      if (tutorialIdArray.length > 0) {
        await getTutorialFeedData(tutorialIdArray)(
          firebase,
          firestore,
          dispatch
        );
      } else {
        setResults([]);
      }
    };

    getResults();
  }, [location.search, propResults, firebase, firestore, dispatch]);

  return (
    <div>
      <Grid container item justify="center">
        <Divider variant="middle" />
        <Grid item xs={12}>
          <Typography align="center" variant="h4">
            Search Results
          </Typography>
        </Grid>
        {propResults && (
          <>
            <Divider variant="middle" />
            <Grid container spacing={3}>
              {results.map((tutorial, index) => (
                <Grid
                  item
                  key={index}
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  xl={2}
                  className="pr-24"
                >
                  <TutorialCard tutorialData={tutorial} loading={false} />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{
            padding: "1rem",
            margin: "0 auto",
            width: "100%",
            maxWidth: "1200px"
          }}
        >
          {!propResults &&
            results.map((tutorial, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ mb: 2 }}
              >
                {!tutorial?.featured_image ? (
                  <CardWithoutPicture tutorial={tutorial} />
                ) : (
                  <CardWithPicture tutorial={tutorial} />
                )}
              </Grid>
            ))}
        </Grid>

        <Grid container justifyContent="center">
          {results.length === 0 && (
            <Typography
              variant="h6"
              component="p"
              color="textSecondary"
              sx={{ marginTop: 2 }}
            >
              No CodeLabz found with the given query.
            </Typography>
          )}
        </Grid>

        <Divider variant="middle" />
      </Grid>
    </div>
  );
};

export default SearchResultsComponent;
