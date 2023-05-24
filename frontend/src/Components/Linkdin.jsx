import { Button } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import { handleLogoutIndicator } from '../utils/helper';


export const LinkedinBtn = ({ fetchAdsData, handleOk }) => {

  const { linkedInLogin } = useLinkedIn({
    clientId: '785n2302jr2bhy',
    redirectUri: `${window.location.origin}/linkedin`,
    scope: 'r_liteprofile',
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


  const handleAuth = (code) => {
    let redirect_uri = 'https://adview.io/linkedin'
    let client_id = '785n2302jr2bhy'
    let client_secret = 'MXOXwBdgiFqx7MXP'
    const params = {
      code,
      grant_type: 'authorization_code',
      redirect_uri,
      client_id,
      client_secret,
    };
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-cors-grida-api-key': '875c0462-6309-4ddf-9889-5227b1acc82c',
    });

    fetch(`https://cors.bridged.cc/https://www.linkedin.com/oauth/v2/accessToken`, {
      method: 'POST',
      headers,
      body: new URLSearchParams(params),
    })
      .then(response => response.json())
      .then(function (response) {
        getuserInfo(response.access_token, code)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // getuserInfo from linkedin via access token 
  const getuserInfo = (token, code) => {
    fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.linkedin.com/v2/me?oauth2_access_token=' +
        token +
        '&projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams),localizedLastName, firstName,lastName,localizedFirstName)',
      )}`,
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(res => {
        if (res.contents) {
          const response = JSON.parse(res.contents);
          let name = response.localizedFirstName + ' ' + response.localizedLastName
          handleOk()
          fetchAdsData(token, 'linkedin', name, code)
          setTimeout(() => { linkedMultiLogin(code) }, 2000)
        }
      })
      .catch(err => {

      });
  }


  let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
  let id = localStorage.getItem('id')
  let userExist = logedInUsers[id]

  const handleRowLogout = () => {
    delete userExist?.linkedin;
    logedInUsers[id] = userExist
    localStorage.setItem("LOGED_IN_USERS", JSON.stringify(logedInUsers));

    // check is indicator exists
    handleLogoutIndicator(id, "linkedin")
    handleOk()
  }

  if (userExist?.linkedin?.name)
    return (
      <div style={{ display: 'flex', flexFlow: 'column' }}>
        <Button disabled className="ModalBtn" style={{ color: '#fff', backgroundColor: '#018F0F' }}>
          LI Ads
        </Button>
        <Button onClick={handleRowLogout}>Logout Linkedin</Button>
      </div>

    )

  const popupWindowURL = new URL(window.location.href);
  const code = popupWindowURL.searchParams.get('code');
  if (code)
    return <LinkedInCallback />;
  return (
    <Button onClick={linkedInLogin} className="ModalBtn" type="primary">
      LI Ads
    </Button>
  );

}


function throttle(func, delay) {
  let lastExecTime = 0;
  return function () {
    const now = new Date().getTime();
    if (now - lastExecTime >= delay) {
      lastExecTime = now;
      func.apply(this, arguments);
    }
  }
}

export const linkedMultiLogin = (code) => {
  let redirect_uri = 'https://adview.io/linkedin'
  let client_id = '785n2302jr2bhy'
  let client_secret = 'MXOXwBdgiFqx7MXP'
  const params = {
    code,
    grant_type: 'authorization_code',
    redirect_uri,
    client_id,
    client_secret,
  };
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-cors-grida-api-key': '875c0462-6309-4ddf-9889-5227b1acc82c',
  });
  fetch(`https://cors.bridged.cc/https://www.linkedin.com/oauth/v2/accessToken`, {
    method: 'POST',
    headers,
    body: new URLSearchParams(params),
  })
}