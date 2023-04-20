import { Button } from 'antd';
import React, { useState } from 'react';
import {
    auth,
    signInWithPopup,
    GoogleAuthProvider,
    googleProvider,
} from "../Config";

export const GoogleBtn = ({ onCloseModal }) => {
    const loginWithGoogle = async (e) => {
        e.preventDefault();
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const accessToken = result?._tokenResponse?.oauthIdToken;
                const refreshToken = result?._tokenResponse?.refreshToken;
                const email = result?.user?.email;
                console.log(result, "res");
                console.log(accessToken, "token");
                if (accessToken && refreshToken) {
                    console.log(accessToken);
                    console.log(refreshToken);
                    onCloseModal();
                }
                onCloseModal();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                onCloseModal();
                return {
                    errorCode,
                    errorMessage,
                };
            });
    };
    return (
        <Button className="ModalBtn" type="primary" onClick={loginWithGoogle}>Google Ads</Button>
    );
}