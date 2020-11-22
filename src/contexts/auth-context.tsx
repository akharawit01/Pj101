import React from "react";
import { User } from "../types/user";
import {
  reqSignInWithGoogle,
  reqSignInWithEmail,
  reqSignOut,
  auth,
} from "services/auth";
import { useConfirm } from "material-ui-confirm";
import { FullPageSpinner } from "components";

interface Props {
  children: React.ReactNode;
}

const AuthContext = React.createContext<object | undefined>(undefined);
AuthContext.displayName = "AuthContext";

const AuthProvider: React.FC<Props> = (props) => {
  const confirm = useConfirm();
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

  const signInWithEmail = React.useCallback(
    (values: { email: string; password: string }) => {
      const { email, password } = values;
      return reqSignInWithEmail(email, password)
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
    },
    []
  );

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
      confirm().then(() =>
        reqSignOut().then(() => {
          setUser({});
        })
      ),
    [confirm]
  );

  const value = React.useMemo(
    () => ({ user, signInWithEmail, signInWithGoogle, signOut }),
    [signInWithEmail, signInWithGoogle, signOut, user]
  );

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
