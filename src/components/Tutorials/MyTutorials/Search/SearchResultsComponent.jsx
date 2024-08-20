import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TutorialCard from "../BaseTutorialsComponent/TutorialCard";
import { searchFromTutorialsIndex } from "../../../../store/actions";

const SearchResultsComponent = ({ results: propResults }) => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      // Search using the query parameter
      const searchResults = searchFromTutorialsIndex(query);
      setResults(searchResults);
    } else {
      // Use results from props if no query parameter is present
      setResults(propResults);
    }
  }, [location.search, propResults]);

  return (
    <div>
      <Grid container item justify="center">
        <Divider variant="middle" />
        <Grid item xs={12}>
          <Typography align="center"> Search Results</Typography>
        </Grid>
        <Divider variant="middle" />
        {results.map((tutorial, index) => (
          <Grid xs={12} sm={6} md={3} lg={2} xl={2} className="pr-24">
            <TutorialCard key={index} tutorialData={tutorial} loading={false} />
          </Grid>
        ))}
        {results.length === 0 && "No CodeLabz with the given query"}

        <Divider variant="middle" />
      </Grid>
    </div>
  );
};

export default SearchResultsComponent;
