import { Button } from 'antd';
import React, { useState } from 'react';

import { LoginSocialLinkedin } from 'reactjs-social-login';

export const LinkedinBtn = ({ fetchAdsData, handleOk }) => {
  return (
    <LoginSocialLinkedin
      client_id={'785n2302jr2bhy'}
      client_secret={'MXOXwBdgiFqx7MXP'}
      // scope='r_ads'
      redirect_uri={`https://adview.io/linkedin`}
      onResolve={({ provider, data }) => {
        console.log("succes ", provider, data)
        handleOk()
        fetchAdsData(data.access_token, 'linkedin')
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