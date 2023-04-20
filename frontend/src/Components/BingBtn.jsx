import { Button } from 'antd';
import React, { useState } from 'react';
import { LoginSocialMicrosoft } from "reactjs-social-login";


export const BingBtn = ({ onCloseModal }) => {
  const handlebingResponse = () => {
    onCloseModal();
  };
  return (
    <LoginSocialMicrosoft
      client_id={'a8e64672-9325-4287-b650-3db8270ba6b6'}
      redirect_uri={'http://localhost:3000/bing'}
      scope={'openid,profile'}
      onResolve={({ provider, data }) => {
        console.log("bing data ", data)
      }}
      onReject={(err) => {
        console.log("shit error ", err)
      }}
    >
      <Button className="ModalBtn" type="primary" onClick={handlebingResponse}>
        Bing
      </Button>
    </LoginSocialMicrosoft>
  );
}