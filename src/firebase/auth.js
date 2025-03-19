import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, fetchSignInMethodsForEmail, linkWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const doSignInWithEmailAndPassword = async (email) => {
  try {
    // Sanitize email for document ID
    const sanitizedEmail = email.replace(/[.@]/g, '_');
    
    // Create a user in Firebase Authentication
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, "defaultPassword123");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        userCredential = await signInWithEmailAndPassword(auth, email, "defaultPassword123");
      } else {
        throw error;
      }
    }

    // Create a document with user data in Firestore
    const userRef = doc(db, 'users', sanitizedEmail);
    const userData = {
      email: email,
      lastLogin: new Date().toISOString(),
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Use merge: true to not overwrite existing data
    await setDoc(userRef, userData, { merge: true });
    console.log("User data stored in Firestore:", userData);
    
    return { user: userData };
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error("Login failed - please try again");
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await fetch('http://localhost:5000/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (response.ok) {
      return data.otp;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Sanitize email for document ID
    const sanitizedEmail = user.email.replace(/[.@]/g, '_');

    // Create a document with user data in Firestore
    const userRef = doc(db, 'users', sanitizedEmail);
    const userData = {
      email: user.email,
      lastLogin: new Date().toISOString(),
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Use merge: true to not overwrite existing data
    await setDoc(userRef, userData, { merge: true });
    console.log("User data stored in Firestore:", userData);
    
    return { user: userData };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw new Error("Google sign-in failed - please try again");
  }
};

export const signInWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Sanitize email for document ID
    const sanitizedEmail = user.email.replace(/[.@]/g, '_');

    // Create a document with user data in Firestore
    const userRef = doc(db, 'users', sanitizedEmail);
    const userData = {
      email: user.email,
      lastLogin: new Date().toISOString(),
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Use merge: true to not overwrite existing data
    await setDoc(userRef, userData, { merge: true });
    console.log("User data stored in Firestore:", userData);
    
    return { user: userData };
  } catch (error) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData.email;
      const pendingCred = GithubAuthProvider.credentialFromError(error);
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.includes(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)) {
        const password = prompt('Please enter your password to link accounts.');
        const credential = EmailAuthProvider.credential(email, password);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await linkWithCredential(userCredential.user, pendingCred);
      } else if (signInMethods.includes(GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD)) {
        const googleProvider = new GoogleAuthProvider();
        const googleResult = await signInWithPopup(auth, googleProvider);
        await linkWithCredential(googleResult.user, pendingCred);
      }
    } else {
      console.error("Error signing in with GitHub:", error);
      throw new Error("GitHub sign-in failed - please try again");
    }
  }
};