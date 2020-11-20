import React from "react";
import { User } from "../types/user";
import { reqSignInWithGoogle, reqSignOut, auth } from "services/auth";
import { FullPageSpinner } from "components";

interface Props {
  children: React.ReactNode;
}

const AuthContext = React.createContext<object | undefined>(undefined);
AuthContext.displayName = "AuthContext";

const AuthProvider: React.FC<Props> = (props) => {
  const [verifying, setVerifying] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User | {}>({});

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((user: any) => {
      user
        ? setUser({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          })
        : setUser({});
      setVerifying(false);
    });
    return () => {
      unsub();
    };
  }, []);

  const signInWithGoogle = React.useCallback(() => {
    setVerifying(true);
    return reqSignInWithGoogle()
      .then((result: any) => {
        setUser({
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        });
      })
      .finally(() => {
        setVerifying(false);
      });
  }, []);

  const signOut = React.useCallback(
    () =>
      reqSignOut().then(() => {
        setUser({});
      }),
    []
  );

  const value = React.useMemo(() => ({ user, signInWithGoogle, signOut }), [
    signInWithGoogle,
    signOut,
    user,
  ]);

  if (verifying) return <FullPageSpinner />;

  return <AuthContext.Provider value={value} {...props} />;
};

function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
export { AuthProvider, useAuth };
