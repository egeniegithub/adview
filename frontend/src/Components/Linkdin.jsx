import { Button } from 'antd';
import React, { useState } from 'react';

import { LoginSocialLinkedin } from 'reactjs-social-login';

export const LinkedinBtn = ({fetchAdsData,handleOk}) => {
  return (
    <LoginSocialLinkedin
      client_id={'774lvbtq5rm9fg'}
      client_secret={'B3Lb8gHf7NANPMN9'}
      // scope='r_ads'
      redirect_uri={'http://localhost:3000/linkedin'}
      onResolve={({ provider, data }) => {
        console.log("succes ", provider, data)
        handleOk()
        fetchAdsData(data.access_token,'linkedin')
      }}
      onReject={(err) => {
        console.log("eeor", err);
      }}
    >
      <Button className="ModalBtn" type="primary">
        Linkedin
      </Button>
    </LoginSocialLinkedin>
  );
}