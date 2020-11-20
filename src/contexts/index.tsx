import React from "react";
import { ConfirmProvider } from "material-ui-confirm";
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
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ConfirmProvider>
  );
};

export { AppProviders, useAuth };
