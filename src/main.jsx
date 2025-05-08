import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global styles
import App from "./App"; // Root component
import * as serviceWorker from "./serviceWorker";

import store, { rrfProps } from "./store";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { ThemeProvider } from "@mui/styles";
import { theme } from "./helpers/themes"; // Custom MUI theme

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* Redux store */}
      <ThemeProvider theme={theme}>
        {" "}
        {/* MUI theme */}
        <ReactReduxFirebaseProvider {...rrfProps}>
          {" "}
          {/* Firebase + Redux */}
          <App />
        </ReactReduxFirebaseProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

serviceWorker.unregister(); // Disable offline support by default
