import React, { useState } from 'react';
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import { Button } from 'antd';

export const GoogleBtn = ({ fetchAdsData, handleOk }) => {

    const GResponseHandler = async (response) => {
        console.log("Google", response)
            if(response.access_token)   
        fetchAdsData(response.access_token, 'google',response.name)
    }

    let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
    let id = localStorage.getItem('id')
    let userExist = logedInUsers[id]

    const handleRowLogout = ()=>{
        delete userExist?.google;
        logedInUsers[id] = userExist
        localStorage.setItem("LOGED_IN_USERS", JSON.stringify(logedInUsers));
        handleOk()
    }

    if(userExist?.google?.name)
        return(
            <div style={{display:'flex',flexFlow:'column',gap:'1%'}}>
                <Button disabled className="ModalBtn" style={{color:'#646464'}} type="primary">
                    {userExist?.google?.name}
                </Button>
                <Button onClick={handleRowLogout}>Logout Google</Button>
            </div>
            
        )
    return (
        <LoginSocialGoogle
            client_id={'179563720213-indaf65t1gs2t3gsm8qhv96jvmms0lmi.apps.googleusercontent.com'}
            scope="openid profile email https://www.googleapis.com/auth/adwords"
            discoveryDocs="claims_supported"
            access_type="offline"
            redirect_uri={`https://adview.io/`}
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
