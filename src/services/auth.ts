import { auth, fbProvider } from "../firebase";

export const reqSignInWithGoogle = () => auth.signInWithPopup(fbProvider);
export const reqSignOut = () => auth.signOut();
export { auth };
