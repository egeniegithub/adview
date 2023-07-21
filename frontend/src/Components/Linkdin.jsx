import { Button, Input, Modal, Switch, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import { handleLogoutIndicator } from '../utils/helper';
import { getLinkedAdsAccountsWithLinkedin } from '../Services/LinkedinLinkedUsers';
import { SearchOutlined } from '@ant-design/icons';
import { GetServerCall } from '../Services/apiCall';

const redirect_uri_ver = 'https://adview.io/linkedin'
// const redirect_uri_ver = 'http://localhost:3000/linkedin'

export const LinkedinBtn = ({ fetchAdsData, handleOk, userData, getdata }) => {
  const [linkedUsers, setLinkedUsers] = useState([])
  const [searchedName, setSearchedName] = useState([])
  const [filteredLinkedUsers, setfilteredLinkedUsers] = useState([])
  const [showLinkedUserModal, setshowLinkedUserModal] = useState(false)
  const [userName, setuserName] = useState('linkedUnser')
  const [access_token, setaccess_token] = useState('')
  const [refresh_token, setrefresh_token_token] = useState('')
  const [selectedRow, setselectedRow] = useState({})
  const [authCodeMultiLogin, setAuthCodeMultiLogin] = useState('')

  const handleConnect = () => {
    if (!selectedRow.customer_ids.length)
      return
    let customer_ids = selectedRow.customer_ids.join(",");
    let customer_names = selectedRow.customer_names.join(",")
    setshowLinkedUserModal(false)
    fetchAdsData({ access_token, refresh_token }, 'linkedin', userName, customer_ids, customer_names, authCodeMultiLogin)
    // fetchAdsData(access_token, 'google', userName, customer_ids, selectedRow.manager_id)
    setSearchedName('')
  }
  useEffect(() => {
    let temp = [...linkedUsers]
    let filterArr = temp.filter(el => {
      if (el.name?.toLowerCase().includes(searchedName))
        return { ...el }
    })
    setfilteredLinkedUsers(filterArr)
  }, [searchedName])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let tempArr = []
      let namesArr = []
      selectedRows.forEach(el => {
        tempArr.push(el.id)
        namesArr.push(el.name)
      })
      if (!tempArr.length)
        return setselectedRow({})
      // pick manager id form any of selected row 
      let { manager_id } = selectedRows[0]
      setselectedRow({ customer_ids: [...tempArr], customer_names: [...namesArr] })
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };


  const { linkedInLogin } = useLinkedIn({
    clientId: `${process.env.REACT_APP_LI_CLIENT_ID}`,
    redirectUri: `${window.location.origin}/linkedin`,
    scope: 'r_liteprofile,rw_ads,r_ads,r_ads_reporting',
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
    let redirect_uri = redirect_uri_ver
    let client_id = `${process.env.REACT_APP_LI_CLIENT_ID}`
    let client_secret = `${process.env.REACT_APP_LI_CLIENT_SECRET}`
    const params = {
      code,
      grant_type: 'authorization_code',
      redirect_uri,
      client_id,
      client_secret,
    };
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-cors-grida-api-key': '875c0462-6309-4ddf-9889-5227b1acc82c'
    });

    fetch(`https://cors.bridged.cc/https://www.linkedin.com/oauth/v2/accessToken`, {
      method: 'POST',
      headers,
      body: new URLSearchParams(params),
    })
      .then(response => response.json())
      .then(function (response) {
        getuserInfo(response, code)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // getuserInfo from linkedin via access token 
  const getuserInfo = async (tokens, code) => {
    linkedMultiLogin()
    let LinkedUsers = await getLinkedAdsAccountsWithLinkedin(tokens.access_token)
    if (LinkedUsers.list.length) {
      LinkedUsers.list.forEach((ele, i) => {
        ele.key = i + 1
        ele.auto_track = false
        ele.account_status = ele.status
      })
      setLinkedUsers(LinkedUsers.list)
      setshowLinkedUserModal(true)
      setaccess_token(tokens.access_token)
      setrefresh_token_token(tokens.refresh_token)
      setAuthCodeMultiLogin(code)
    }
    fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.linkedin.com/v2/me?oauth2_access_token=' +
        tokens.refresh_token +
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
          setuserName(name)
        }
      })
      .catch(err => {

      });
  }


  const handleRowLogout = async () => {
    await GetServerCall('/linkedin-ads/logout-user/' + userData.email)
    // check is indicator exists
    let id = localStorage.getItem('id')
    handleLogoutIndicator(id, "linkedin")
    getdata()
    handleOk()
  }

  if (userData?.is_linkedin_login == '1')
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
    <>
      <div>
        <Button onClick={linkedInLogin} className="ModalBtn" type="primary">
          LI Ads
        </Button>
      </div>
      <Modal
        title={<h5 style={{ padding: "2.5% 0% 0px 2.5%" }} >Select Linkedin ad Accounts to link</h5>}
        width={"67%"}
        open={showLinkedUserModal}
        className='responsive_warper'
        onOk={() => { setshowLinkedUserModal(false) }}
        closable={false}
        bodyStyle={{ padding: "2.5% 3.5%" }}
        footer={null}
      >

        <Table
          scroll={{ x: 700 }}
          bordered
          className='rowCustomerClassName2'
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          columns={[
            {
              title: "AD ACCOUNT",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "AD ACCOUNT ID",
              dataIndex: "id",
              key: "id"
            },
            {
              title: "Status",
              dataIndex: "account_status",
              key: "account_status",
            },
            {
              title: "AUTO TRACKING",
              dataIndex: "status",
              key: "status",
              width: '15%',
              render: (text, record) => <Switch checked={record.auto_track} onChange={
                () => {
                  setLinkedUsers(
                    prevArray =>
                      prevArray.map(item => {
                        if (item.id == record.id) {
                          return {
                            ...item,
                            auto_track: !item.auto_track
                          };
                        }
                        else
                          return { ...item };
                      })
                  )
                }
              } />
            },
            {
              title: () => (<div style={{ position: 'relative' }}>
                <Input onChange={({ target }) => { setSearchedName(target.value) }} placeholder="Search by name.." style={{ width: "90%", marginBottom: '.3rem', borderRadius: '30px' }} />
                <SearchOutlined
                  style={{
                    color: '#0c0808', position: 'absolute', right: "13%", top: '25%',
                  }}
                />
              </div>
              ),
              dataIndex: "",
              key: "",
              width: '20%'
            },
          ]}
          dataSource={searchedName != '' ? filteredLinkedUsers : linkedUsers}
        />
        <div style={{ display: 'flex', gap: '2%' }}>
          <Button style={{ flexBasis: '20%' }} type='primary' onClick={handleConnect}>Connect</Button>
          <Button style={{ flexBasis: '20%' }} onClick={() => { setshowLinkedUserModal(false); setLinkedUsers([]) }}>Cancel</Button>
        </div>
      </Modal>

    </>

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

export const linkedMultiLogin = () => {
  const popup = window.open(
    `https://linkedin.com/m/logout`,
    'linkedin-login',
    'width=1,height=1'
  );

  setTimeout(() => {
    popup.close()
  }, 5000);
}