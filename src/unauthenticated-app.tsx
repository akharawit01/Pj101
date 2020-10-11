import React from "react";
import { useAuth } from "./contexts";

type Props = {} & typeof defaultProps;
const defaultProps = {};

const UnauthenticatedApp = (props: Props) => {
  const { signInWithGoogle }: any = useAuth();

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  );
};
UnauthenticatedApp.defaultProps = defaultProps;

export default UnauthenticatedApp;
