import { Button } from 'antd';
import React, { useState } from 'react';
import { LoginSocialMicrosoft } from "reactjs-social-login";


export const BingBtn = ({ fetchAdsData, handleOk }) => {
  let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
  let id = localStorage.getItem('id')
  let userExist = logedInUsers[id]
  if(userExist?.bing?.name)
  return(
    <Button disabled className="ModalBtn" style={{color:'#646464'}} type="primary">
    {userExist?.bing?.name}
    </Button>
  )

  return (
    <LoginSocialMicrosoft
      client_id={`a8e64672-9325-4287-b650-3db8270ba6b6`}
      redirect_uri={`http://localhost:3000/bing`}
      scope={'User.Read'}
      onResolve={({ provider, data }) => {
        handleOk()
        if (data.access_token) {
          let token = data.access_token.split('/')
          fetchAdsData(token[0], 'bing',data.displayName || '')
          console.log("bing data ", data)
        }
      }}
      onReject={(err) => {
        // console.log("shit error ", err)
        handleOk()
      }}
    >
      <Button className="ModalBtn" type="primary">
        Bing
      </Button>
    </LoginSocialMicrosoft>
  );
}