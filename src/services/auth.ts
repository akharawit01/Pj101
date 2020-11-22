import { auth, fbProvider } from "../firebase";

export const reqSignInWithGoogle = () => auth.signInWithPopup(fbProvider);
export const reqSignInWithEmail = (
  email: string,
  password: string
): Promise<any> => auth.signInWithEmailAndPassword(email, password);
export const reqSignOut = () => auth.signOut();
export { auth };
