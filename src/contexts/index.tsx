import React from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth-context";

type AppProvidersProps = {
  children: React.ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ConfirmProvider>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ConfirmProvider>
  );
};

export { AppProviders, useAuth };
