import { Button, Input, Modal, Switch, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { LoginSocialMicrosoft } from "reactjs-social-login";
import { handleLogoutIndicator } from '../utils/helper';
import { getAccountDetails } from '../Services/BingLinkedUsers';
import { SearchOutlined } from '@ant-design/icons';
import { GetServerCall } from '../Services/apiCall';


export const BingBtn = ({ fetchAdsData, handleOk,getdata,userData }) => {
  const [linkedUsers, setLinkedUsers] = useState([])
  const [seacrhedName, setSeacrhedName] = useState([])
  const [filteredLinkedUsers, setfilteredLinkedUsers] = useState([])
  const [showLinkedUserModal, setshowLinkedUserModal] = useState(false)
  const [userName, setuserName] = useState('')
  const [access_token, setaccess_token] = useState('')
  const [selectedRow, setselectedRow] = useState({})
  const [refresh_token, setrefresh_token_token] = useState('')
  let id = localStorage.getItem('id')

  useEffect(() => {
    let temp = [...linkedUsers]
    let filterArr = temp.filter(el => {
      if (el.name?.toLowerCase().includes(seacrhedName))
        return { ...el }
    })
    setfilteredLinkedUsers(filterArr)
  }, [seacrhedName])



  const handleConnect = () => {
    if (!selectedRow.customer_ids.length)
      return
      let customer_ids = selectedRow.customer_ids.join(",");
      let customer_names = selectedRow.customer_names.join(",")
      let manager_id=selectedRow.manager_id
    setshowLinkedUserModal(false)
    // fetchAdsData(access_token, 'bing', userName, customer_ids)
    fetchAdsData({access_token,refresh_token}, 'bing', userName, customer_ids,customer_names,manager_id )
    setSeacrhedName('')
  }

  const handleRowLogout =async () => {

    await GetServerCall('/bing-ads/logout-user/'+userData.email)
        getdata()
    // check is indicator exists
    handleLogoutIndicator(id, "bing")

    handleOk()
  }

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
      let { manager_id = '' } = selectedRows[0]
      setselectedRow({ customer_ids: [...tempArr], customer_names: [...namesArr],manager_id })
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  if (userData?.is_bing_login =='1')
    return (
      <div style={{ display: 'flex', flexFlow: 'column' }}>
        <Button disabled className="ModalBtn" style={{ color: '#fff', backgroundColor: '#018F0F' }}>
          Bing Ads
        </Button>
        <Button onClick={handleRowLogout}>Logout Bing</Button>
      </div>
    )

  return (
    <>
      <LoginSocialMicrosoft
        client_id={`b2d7eb5f-e889-4f34-a297-7221ce6c26e7`}
        // redirect_uri={`http://localhost:3000/bing`}
        redirect_uri={`https://adview.io/bing`}
        scope={'https://ads.microsoft.com/msads.manage'}
        // https://ads.microsoft.com/msads.manage}
        onResolve={async ({ provider, data }) => {
          if (data.access_token) {
            let { name, connected_accounts, manager_id } = await getAccountDetails(data.access_token)
            
            connected_accounts.forEach((ele, i) => {
                ele.key = i + 1
                ele.auto_track = false
                ele.manager_id = manager_id
            })
            setLinkedUsers(connected_accounts)
            if (connected_accounts.length)
              setshowLinkedUserModal(true)
              setaccess_token(data.access_token)
              setrefresh_token_token(data.refresh_token)
              setuserName(name)
          }
        }}
        onReject={(err) => {
          handleOk()
        }}
      >
        <Button className="ModalBtn" type="primary">
          Bing Ads
        </Button>
      </LoginSocialMicrosoft>

      <Modal
        title={<h5 style={{ padding: "2.5% 0% 0px 2.5%" }} >Select Meta ad Accounts to link</h5>}
        width={"67%"}
        open={showLinkedUserModal}
        className='responsive_warper'
        onOk={() => { setshowLinkedUserModal(false) }}
        closable={false}
        bodyStyle={{ padding: "2.5% 3.5%" }}
        footer={null}
      >

        <Table
          bordered
          scroll={{ x: 700 }}
          className='rowCustomeClassName2'
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
              dataIndex: "status",
              key: "status",
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
                <Input onChange={({ target }) => { setSeacrhedName(target.value) }} placeholder="Search by name.." style={{ width: "90%", marginBottom: '.3rem', borderRadius: '30px' }} />
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
          dataSource={seacrhedName != '' ? filteredLinkedUsers : linkedUsers}
        />
        <div style={{ display: 'flex', gap: '2%' }}>
          <Button style={{ flexBasis: '20%' }} type='primary' onClick={handleConnect}>Connect</Button>
          <Button style={{ flexBasis: '20%' }} onClick={() => { setshowLinkedUserModal(false); setLinkedUsers([]) }}>Cancel</Button>
        </div>
      </Modal>
    </>

  );
}

