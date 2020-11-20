import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useAuth } from "./contexts";
import { FullPageSpinner } from "components";
import { isEmpty } from "lodash";

const AuthenticatedApp = React.lazy(() => import("./authenticated-app"));
const UnauthenticatedApp = React.lazy(() => import("./unauthenticated-app"));

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Sarabun", "sans-serif"].join(","),
  },
});

const App: React.FC = () => {
  const { user }: any = useAuth();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Suspense fallback={<FullPageSpinner />}>
        {!isEmpty(user) ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </React.Suspense>
    </ThemeProvider>
  );
};

export default App;
