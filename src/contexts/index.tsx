import React from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth-context";

const AppProviders: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  return (
    <ConfirmProvider
      defaultOptions={{
        title: "คุณแน่ใจแล้วใช่ไหม?",
        confirmationText: "ยืนยัน",
        cancellationText: "ยกเลิก",
      }}
    >
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Router>
          <AuthProvider>{children}</AuthProvider>
        </Router>
      </SnackbarProvider>
    </ConfirmProvider>
  );
};

export { AppProviders, useAuth };
