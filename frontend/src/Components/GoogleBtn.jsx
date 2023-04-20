import React, { useState } from 'react';
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import { Button } from 'antd';

export const GoogleBtn = ({ fetchAdsData, handleOk }) => {

    const GResponseHandler = async (response) => {
        console.log("Google", response)
        handleOk()
            if(response.access_token)   
        fetchAdsData(response.access_token, 'google')

    }
    return (
        <LoginSocialGoogle
            client_id={process.env.REACT_APP_GG_APP_ID || '1008345619855-iralf41l1ug3b8nvrsr124m2abjvboom.apps.googleusercontent.com'}
            scope="openid profile email"
            discoveryDocs="claims_supported"
            access_type="offline"
            redirect_uri={'http://localhost:3000/'}
            onResolve={({ provider, data }) => {
                GResponseHandler(data)
            }}
            onReject={err => {
                GResponseHandler(err)
            }}
        >
            <Button className="ModalBtn" type="primary">
                google Ads
            </Button>
        </LoginSocialGoogle>
    );
}
