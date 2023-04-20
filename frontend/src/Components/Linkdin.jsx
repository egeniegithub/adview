import { Button } from 'antd';
import React, { useState } from 'react';

import { LoginSocialLinkedin } from 'reactjs-social-login';

export const LinkedinBtn = ({ onCloseModal }) => {
  const handleLinkedinResponse = () => {
    onCloseModal();
  };
  return (
    <LoginSocialLinkedin
      client_id={'774lvbtq5rm9fg'}
      client_secret={'B3Lb8gHf7NANPMN9'}
      redirect_uri={'http://localhost:3000/linkedin'}
      onResolve={({ provider, data }) => {
        console.log("succes ", provider, data)
        window.close()
      }}
      onReject={(err) => {
        console.log("eeor", err);
        window.close()
      }}
    >
      <Button className="ModalBtn" type="primary" onClick={handleLinkedinResponse}>
        Linkedin
      </Button>
    </LoginSocialLinkedin>
  );
}