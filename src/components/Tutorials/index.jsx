import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Box, useMediaQuery } from "@mui/material";
import StepsPanel from "./subComps/StepsPanel";
import { TutorialTimeRemaining } from "../../helpers/tutorialTime";
import ControlButtons from "./subComps/ControlButtons";
import TutorialHeading from "./subComps/TutorialTitle";
import EditControls from "./subComps/EditControls";
import ImageDrawer from "./subComps/ImageDrawer";
import StepsTitle from "./subComps/StepsTitle";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getCurrentStepContentFromFirestore,
  getCurrentTutorialData,
  setCurrentStepNo
} from "../../store/actions";
import { useFirebase, useFirestore } from "react-redux-firebase";
import Spinner from "../../helpers/spinner";
import AddNewStepModal from "./subComps/AddNewStep";
import QuillEditor from "../Editor/QuillEditor";
import HtmlTextRenderer from "./subComps/HtmlTextRenderer";
import { Collapse, Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
  flexRow: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column"
    }
  },
  collapseContainer: {
    minWidth: "100%",
    "& > div > div": {
      minWidth: "100%"
    },
    overflow: "hidden",
    transition: theme.transitions.create(["width"])
  },
  widthTransition: {
    overflow: "hidden",
    transition: theme.transitions.create(["width"])
  },
  expandButton: {
    position: "fixed",
    left: "10px",
    top: "100px",
    zIndex: 1100,
    backgroundColor: "white",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "50%",
    padding: "8px",
    minWidth: "auto",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    },
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  rotateChildren: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  ExpandIcon: {
    fontSize: 24,
    color: "#03AAFA"
  },
  editorContainer: {
    flexGrow: 1,
    padding: "16px",
    [theme.breakpoints.down("md")]: {
      padding: "12px"
    },
    [theme.breakpoints.down("sm")]: {
      padding: "20px 8px"
    },
    overflow: "hidden",
    background: "white",
    position: "relative"
  }
}));

const ExpandMore = props => {
  const { expand, children, ...other } = props;
  const classes = useStyles({ expand });

  return (
    <Button {...other} className={classes.expandButton}>
      <div
        className={classes.rotateChildren}
        style={{ transform: !expand ? "rotate(270deg)" : "rotate(90deg)" }}
      >
        {children}
      </div>
    </Button>
  );
};

const ViewTutorial = () => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepPanelVisible, setStepPanelVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mode, setMode] = useState("view");
  const [allowEdit, setAllowEdit] = useState(true);
  const [imageDrawerVisible, setImageDrawerVisible] = useState(false);
  const [addNewStepModalVisible, setAddNewStepModalVisible] = useState(false);
  const [currentStepContent, setCurrentStepContent] = useState(null);
  const [stepsData, setStepData] = useState(null);
  const [tutorialData, setTutorialData] = useState(null);
  const [expand, setExpand] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const { owner, tutorial_id } = useParams();
  const classes = useStyles();

  useEffect(() => {
    getCurrentTutorialData(owner, tutorial_id)(firebase, firestore, dispatch);
  }, [owner, tutorial_id, firebase, firestore, dispatch]);

  const currentStepNo = useSelector(
    ({
      tutorials: {
        editor: { current_step_no }
      }
    }) => current_step_no
  );

  const currentTutorialData = useSelector(
    ({
      tutorials: {
        current: { data }
      }
    }) => data
  );

  useEffect(() => {
    if (currentTutorialData) {
      const { steps } = currentTutorialData;
      setStepData(steps);
      setTutorialData(currentTutorialData);
    }
  }, [currentTutorialData]);

  const editorStepData = useSelector(
    ({
      tutorials: {
        editor: { current_step }
      }
    }) => current_step
  );

  useEffect(() => {
    setCurrentStepContent(editorStepData);
  }, [editorStepData]);

  useEffect(() => {
    setAllowEdit(true); // remove this later
    setStepPanelVisible(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (stepsData) {
      setTimeRemaining(TutorialTimeRemaining(stepsData, currentStep));
      getCurrentStepContentFromFirestore(
        tutorial_id,
        stepsData[currentStep].id
      )(firestore, dispatch);
    }
  }, [tutorial_id, firebase, stepsData, currentStep, dispatch]);

  const onChange = current => {
    setCurrentStepNo(current)(dispatch);
    !isDesktop &&
      setTimeout(() => {
        setStepPanelVisible(false);
      }, 300);
  };

  useEffect(() => {
    setCurrentStep(currentStepNo);
  }, [currentStepNo]);

  if (tutorialData) {
    window.scrollTo(0, 0);
    return (
      <Grid container className="row-footer-below">
        {allowEdit && (
          <Grid item xs={12}>
            <EditControls
              isPublished={tutorialData.isPublished}
              stepPanelVisible={stepPanelVisible}
              expand={expand}
              isDesktop={isDesktop}
              noteID={stepsData[currentStep].id}
              setMode={mode => setMode(mode)}
              mode={mode}
              toggleImageDrawer={() => setImageDrawerVisible(true)}
              tutorial_id={tutorialData.tutorial_id}
              toggleAddNewStep={() =>
                setAddNewStepModalVisible(!addNewStepModalVisible)
              }
              visibility={stepsData[currentStep].visibility}
              owner={owner}
              currentStep={currentStep}
              step_length={stepsData.length}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TutorialHeading
            stepPanelVisible={stepPanelVisible}
            isDesktop={isDesktop}
            setStepPanelVisible={setStepPanelVisible}
            tutorialData={tutorialData}
            timeRemaining={timeRemaining}
          />
        </Grid>
        <Grid
          item
          xs={12}
          className={classes.flexRow}
          sx={{ position: "relative" }}
        >
          {!isDesktop && (
            <ExpandMore
              data-testid="tutorial-collapse-button"
              expand={expand}
              onClick={() => {
                setExpand(prev => !prev);
                setStepPanelVisible(prev => !prev);
              }}
              aria-expanded={expand}
              aria-label="show more"
            >
              <ExpandMoreIcon className={classes.ExpandIcon} />
            </ExpandMore>
          )}

          {isDesktop ? (
            <Grid
              item
              sx={{
                width: stepPanelVisible
                  ? isDesktop
                    ? "max(20%, 250px)"
                    : "100%"
                  : "0",
                minWidth: stepPanelVisible
                  ? isDesktop
                    ? "250px"
                    : "100%"
                  : "0",
                padding: stepPanelVisible ? "0" : "0",
                display: stepPanelVisible ? "block" : "none",
                overflow: "hidden",
                transition: "width 0.3s"
              }}
              className={classes.widthTransition}
            >
              <Collapse
                data-testid="tutorial-steps-list"
                in={expand}
                timeout="auto"
                unmountOnExit
                orientation="horizontal"
                className={classes.collapseContainer}
              >
                <StepsPanel
                  currentStep={currentStep}
                  onChange={onChange}
                  stepsData={stepsData}
                  onClick={() => setStepPanelVisible(false)}
                  hideButton={isDesktop}
                  setCurrentStep={setCurrentStep}
                  setStepData={setStepData}
                />
              </Collapse>
            </Grid>
          ) : (
            <Drawer
              anchor="left"
              open={stepPanelVisible}
              onClose={() => setStepPanelVisible(false)}
              PaperProps={{
                sx: { width: "80%", maxWidth: "300px" }
              }}
            >
              <StepsPanel
                currentStep={currentStep}
                onChange={onChange}
                stepsData={stepsData}
                onClick={() => setStepPanelVisible(false)}
                hideButton={false}
                setCurrentStep={setCurrentStep}
                setStepData={setStepData}
              />
            </Drawer>
          )}

          <Grid item sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Grid
              className="tutorial-content"
              justifyContent="center"
              container
            >
              <Grid
                item
                xs={12}
                md={10}
                lg={9}
                className="col-pad-24-s mt-24-od tutorial-paper"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                {!isDesktop && stepPanelVisible ? null : (
                  <>
                    {mode === "view" && (
                      <div data-testId="tutorial-content">
                        <HtmlTextRenderer html={currentStepContent} />
                      </div>
                    )}
                    {mode === "edit" && (
                      <>
                        <StepsTitle
                          currentStepNo={currentStepNo}
                          owner={tutorialData.owner}
                          tutorial_id={tutorialData.tutorial_id}
                          step_id={stepsData[currentStep].id}
                          step_title={stepsData[currentStep].title}
                          step_time={stepsData[currentStep].time}
                        />

                        <QuillEditor
                          data={stepsData[currentStep].content}
                          tutorial_id={tutorialData.tutorial_id}
                          id={stepsData[currentStep].id}
                          key={
                            stepsData[currentStep].title +
                            stepsData[currentStep].id
                          }
                          mode={mode}
                        />
                      </>
                    )}
                  </>
                )}
                <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #eee" }}>
                  <ControlButtons
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    stepsData={stepsData}
                    setStepData={setStepData}
                    hide={false}
                  />
                </Box>
              </Grid>
              {imageDrawerVisible && (
                <ImageDrawer
                  visible={imageDrawerVisible}
                  onClose={() => setImageDrawerVisible(false)}
                  owner={tutorialData.owner}
                  tutorial_id={tutorialData.tutorial_id}
                  imageURLs={tutorialData.imageURLs}
                />
              )}
              <AddNewStepModal
                viewModal={addNewStepModalVisible}
                viewCallback={() =>
                  setAddNewStepModalVisible(!addNewStepModalVisible)
                }
                tutorial_id={tutorialData.tutorial_id}
                steps_length={stepsData.length}
                owner={tutorialData.owner}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    return <Spinner half />;
  }
};

export default ViewTutorial;
