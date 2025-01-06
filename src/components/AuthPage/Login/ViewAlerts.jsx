import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/lab/Alert";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { resendVerifyEmail } from "../../../store/actions";

const AlertComp = ({ description, type }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapse in={isOpen}>
      <Alert
        severity={type ? type : "error"}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        className="mb-16"
      >
        {description}
      </Alert>
    </Collapse>
  );
};

const ViewAlerts = ({ error, successMessage }) => {
  const history = useHistory();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const errorProp = useSelector(({ auth }) => auth.verifyEmail.error);
  const loadingProp = useSelector(({ auth }) => auth.verifyEmail.loading);
  const email = useSelector(({ auth }) => auth.verifyEmail.email);

  useEffect(() => setResendError(errorProp), [errorProp]);
  useEffect(() => setResendLoading(loadingProp), [loadingProp]);

  useEffect(() => {
    if (errorProp === false && loadingProp === false) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  }, [errorProp, loadingProp]);

  useEffect(() => {
    if (successMessage) {
      // If success message is received, set success state to true
      setSuccess(true);

      // Set a timer to clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccess(false);
        // Reset location state
        history.replace({ ...history.location, state: { successMessage: "" } });
      }, 5000);

      // Return a cleanup function to clear the timer when the component unmounts or successMessage changes
      return () => clearTimeout(timer);
    }
  }, [successMessage, history]);

  return (
    <>
      {error && error !== "email-unverified" && !resendError && (
        <AlertComp description={error} />
      )}

      {error && error === "email-unverified" && !resendError && (
        <AlertComp
          description={
            <>
              Please verify your email. Click{" "}
              <Button
                type="link"
                onClick={() => resendVerifyEmail(email)(dispatch)}
                className="pl-0 pr-0"
              >
                here
              </Button>{" "}
              to resend the verification email.
            </>
          }
        />
      )}

      {resendError && <AlertComp description={resendError} />}

      {resendLoading && (
        <AlertComp description={"Resending the verification email..."} />
      )}

      {success && <AlertComp description={successMessage} type="success" />}
    </>
  );
};

export default ViewAlerts;
