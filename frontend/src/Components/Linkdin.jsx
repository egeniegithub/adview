import { Button } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { useLinkedIn } from 'react-linkedin-login-oauth2';


export const LinkedinBtn = ({fetchAdsData,handleOk}) => {

  const { linkedInLogin } = useLinkedIn({
    clientId: '785n2302jr2bhy',
    redirectUri: `${window.location.origin}/linkedin`,
    scope:'r_liteprofile',
    onSuccess: (code) => {
      throttledFunction(code);
    },
    onError: (error) => {
      // console.log("error",error);
    },
  });

  function doSomething(code) {
    handleAuth(code)
  }
  // throttled used to prevent multi api calls 
  const throttledFunction = throttle(doSomething, 1000);
  
  
  const handleAuth =(code)=>{
    let redirect_uri = 'http://localhost:3000/linkedin'
    let client_id='785n2302jr2bhy'
    let client_secret='MXOXwBdgiFqx7MXP'
    var config = {
      method: 'post',
      url: `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}`
    };
    
    axios(config)
    .then(function (response) {
      getuserInfo(response.data.access_token)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // getuserInfo from linkedin via access token 
  const getuserInfo =(token)=>{
    fetch(`https://api.linkedin.com/v2/me?oauth2_access_token=${token}&projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams),localizedLastName, firstName,lastName,localizedFirstName)`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        let name = response.localizedFirstName+' '+response.localizedLastName
        handleOk()
        fetchAdsData(token,'linkedin',name)
      })
      .catch(err => {
        
      });
  }


  let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
  let id = localStorage.getItem('id')
  let userExist = logedInUsers[id]
  if(userExist?.linkedin?.name)
    return(
        <Button disabled className="ModalBtn" style={{color:'#646464'}} type="primary">
            {userExist?.linkedin?.name}
        </Button>
    )

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


function throttle(func, delay) {
  let lastExecTime = 0;
  return function() {
    const now = new Date().getTime();
    if (now - lastExecTime >= delay) {
      lastExecTime = now;
      func.apply(this, arguments);
    }
  }
}