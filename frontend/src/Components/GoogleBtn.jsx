import React, { useState } from 'react';
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import { Button } from 'antd';

export const GoogleBtn = ({ fetchAdsData, handleOk }) => {

    const GResponseHandler = async (response) => {
        console.log("Google", response)
        handleOk()
            if(response.access_token)   
        fetchAdsData(response.access_token, 'google',response.name)
    }

    let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
    let id = localStorage.getItem('id')
    let userExist = logedInUsers[id]
    if(userExist?.google?.name)
        return(
            <Button disabled className="ModalBtn" style={{color:'#646464'}} type="primary">
                {userExist?.google?.name}
            </Button>
        )
    return (
        <LoginSocialGoogle
            client_id={process.env.REACT_APP_GG_APP_ID || '1008345619855-iralf41l1ug3b8nvrsr124m2abjvboom.apps.googleusercontent.com'}
            scope="openid profile email https://www.googleapis.com/auth/adwords"
            discoveryDocs="claims_supported"
            access_type="offline"
            redirect_uri={`http://localhost:3000/`}
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
