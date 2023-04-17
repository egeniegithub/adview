import React, { useState } from 'react';
import { LoginSocialFacebook } from "reactjs-social-login";
import { Button } from 'antd';

export const Facebook = ({ fetchAdsData, handleOk }) => {

    const FbResponseHandler = async (response) => {
        console.log("facebook", response)
        handleOk()
        fetchAdsData('', response.accessToken, 'facebook')

    }
    return (
        <LoginSocialFacebook
            appId={'5498527660249813'}
            fieldsProfile={
                'id'
            }
            scope='ads_read,read_insights,ads_management'
            redirect_uri={'http://localhost:3000/'}
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
