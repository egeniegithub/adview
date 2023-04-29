import React, { useState } from 'react';
import { LoginSocialFacebook } from "reactjs-social-login";
import { Button } from 'antd';

export const Facebook = ({ fetchAdsData, handleOk }) => {

    const FbResponseHandler = async (response) => {
        console.log("facebook", response)
        handleOk()
        if(response.accessToken)
            fetchAdsData(response.accessToken, 'facebook',response.name)

    }

    let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
    let id = localStorage.getItem('id')
    let userExist = logedInUsers[id]
    if(userExist?.facebook?.name)
        return(
            <Button disabled className="ModalBtn" style={{color:'#646464'}} type="primary">
                {userExist?.facebook?.name}
            </Button>
        )

    return (
        <LoginSocialFacebook
            appId={process.env.REACT_APP_FB_CLIENT_ID || 5498527660249813}
            fieldsProfile={
                'id,name'
            }
            scope='ads_read,read_insights,ads_management'
            redirect_uri={`https://adview.io/`}
            onResolve={({ provider, data }) => {
                FbResponseHandler(data)
            }}
            onReject={err => {
                FbResponseHandler(err)
            }}
        >
            <Button className="ModalBtn" type="primary">
                Meta Ads
            </Button>
        </LoginSocialFacebook>
    );
}
