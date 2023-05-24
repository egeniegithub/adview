// this file is not being used
import {
    auth,
    signInWithPopup,
    GoogleAuthProvider,
    googleProvider,
} from "../Config";

export const loginWithGoogle = async (e) => {
    e.preventDefault();
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const accessToken = result?._tokenResponse?.oauthIdToken;
            const refreshToken = result?._tokenResponse?.refreshToken;
            const email = result?.user?.email;
            // console.log(result, "res");
            // console.log(accessToken, "token");
            if (accessToken && refreshToken) {
                // console.log(accessToken);
                // console.log(refreshToken);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            return {
                errorCode,
                errorMessage,
            };
        });
};