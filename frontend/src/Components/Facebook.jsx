import React, { useState } from 'react';
import ReactFacebookLogin from "react-facebook-login";
import { FacebookAuthResponse } from '../Services/FacebookAuth';

export const Facebook = (props) => {
    const { isLoggedIn, setIsLoggedIn, onCloseModal } = props
    const FbResponseHandler = async (response) => {
        await FacebookAuthResponse(response)
        setIsLoggedIn(true)
    }
    const handleFbResponse = () => {
        onCloseModal();
    };
    return (
        <ReactFacebookLogin
            appId={'424033123077473'}
            autoLoad={false}
            fields="name,email,picture"
            callback={FbResponseHandler}
            textButton='Meta Ads'
            className='fb-login-btn'
            onClick={handleFbResponse}
        />
    );
}