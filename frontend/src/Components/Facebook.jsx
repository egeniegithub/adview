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
            appId={'5820494338079670'}
            fieldsProfile={
                'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender'
            }
            redirect_uri={'http://localhost:3000/facebook'}
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
