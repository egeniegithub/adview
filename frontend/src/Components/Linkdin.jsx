import { Button } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { useLinkedIn } from 'react-linkedin-login-oauth2';


export const LinkedinBtn = ({fetchAdsData,handleOk}) => {

  const { linkedInLogin } = useLinkedIn({
    clientId: '785n2302jr2bhy',
    redirectUri: `${window.location.origin}/linkedin`, 
    onSuccess: (code) => {
      handleOk()
      fetchAdsData(code,'linkedin')
      // handleAuth(code)
    },
    onError: (error) => {
      // console.log("error",error);
    },
  });

  const handleAuth =(code)=>{
    let redirect_uri = 'https://adview.io/linkedin'
    let client_id='785n2302jr2bhy'
    let client_secret='MXOXwBdgiFqx7MXP'
    var config = {
      method: 'post',
      url: `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}`
    };
    
    axios(config)
    .then(function (response) {
      console.log("succes ",response.data);
      handleOk()
      fetchAdsData(code,'linkedin')
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const popupWindowURL = new URL(window.location.href);
  const code = popupWindowURL.searchParams.get('code');
  if(code)
    return <LinkedInCallback />;
  return (
    <Button onClick={linkedInLogin} className="ModalBtn" type="primary">
    Linkedin
  </Button>
  );
  
}