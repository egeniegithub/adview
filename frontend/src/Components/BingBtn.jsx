import { Button } from 'antd';
import React, { useState } from 'react';
import { LoginSocialMicrosoft } from "reactjs-social-login";


export const BingBtn = ({ fetchAdsData, handleOk }) => {
  let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
  let id = localStorage.getItem('id')
  let userExist = logedInUsers[id]

  const handleRowLogout = ()=>{
    delete userExist?.bing;
    logedInUsers[id] = userExist
    localStorage.setItem("LOGED_IN_USERS", JSON.stringify(logedInUsers));
    handleOk()
  }
  if(userExist?.bing?.name)
  return(
    <div style={{display:'flex',flexFlow:'column'}}>
      <Button disabled className="ModalBtn" style={{color:'#646464'}} type="primary">
      {userExist?.bing?.name}
      </Button>
      <Button onClick={handleRowLogout}>Logout Bing</Button>
    </div>
  )

  return (
    <LoginSocialMicrosoft
      client_id={`b2d7eb5f-e889-4f34-a297-7221ce6c26e7`}
      redirect_uri={`https://adview.io/bing`}
      scope={'User.Read'}
      // https://ads.microsoft.com/msads.manage}
      onResolve={({ provider, data }) => {
        handleOk()
        if (data.access_token) {
          let token = data.access_token.split('/')
          fetchAdsData(token[0], 'bing',data.displayName || '')
          // console.log("bing data ", data)
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