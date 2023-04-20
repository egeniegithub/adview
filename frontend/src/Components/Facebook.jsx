import React, { useState } from 'react';
import { LoginSocialFacebook } from "reactjs-social-login";
import { Button } from 'antd';

export const Facebook = ({ fetchAdsData, onCloseModal }) => {

    const FbResponseHandler = async (response) => {
        console.log("facebook", response)
        fetchAdsData('', response.accessToken, 'facebook')

    }
    const handleFbResponse = () => {
        onCloseModal();
    };
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
            <Button className="ModalBtn" type="primary" onClick={handleFbResponse}>
                Meta Ads
            </Button>
        </LoginSocialFacebook>
    );
}
