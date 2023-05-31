import React, { Fragment, useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Spin } from "antd";
import axios from "axios";
import {
  WarningOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons/lib/icons";
import "../styles/table.css";

import { loginWithBing } from "../Services/bingAuth";
import { LinkedinBtn } from "./Linkdin";
import { BingBtn } from "./BingBtn";
import { Facebook } from "./Facebook";
import { getBubbleUsers } from "../Services/BubbleIo";
import { GoogleBtn } from "./GoogleBtn";
import { GetServerCall, PostServerCall } from "../Services/apiCall";
import { getAccosiatedUstomers } from "../Services/googleLinkedUsers";
import { LinkedAccountsToClient } from "./LinkedAccountsToClient";

const AdviewTable = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsloading] = useState(true)
  const [showClientLinkedActsModal, setShowClientLinkedActsModal] = useState(false)
  const [currentProvider, setCurrentProvider] = useState('')
  const [timmerCount, settimmerCount] = useState(0)
  useEffect(() => {
    getdata()
  }, [])

  // refresh data after 2 sec must track api calls to prevent infinite calls 
  useEffect(()=>{
    let timer
    if(!isloading && tableData.length == 0 && timmerCount < 30)
    timer =  setTimeout(() => {
      getdata()
      let t = timmerCount
      settimmerCount(t+1)
    }, 2000)
    return () => clearTimeout(timer);
  },[isloading,tableData])

  
  const getdata = async () => {
    setIsloading(true)
    try {
      const response = await GetServerCall(`/client-data`)
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        let { facebook = 0, bing = 0, linkedin = 0, google = 0 } = data[i]
        data[i]["key"] = i + 1;
        data[i]["Link"] = "Link";

        data[i].monthly_spent = parseInt(facebook) + parseInt(google) + parseInt(bing) + parseInt(linkedin)
      }
      setTableData(data)
      setIsloading(false)
    } catch (error) {
      setIsloading(false)
    }
    const bubble = await getBubbleUsers()
    // console.log("check bubble response ", bubble)
  }


  const fetchAdsData = async (accessToken, provider_name, user_name, customer_ids, manager_id) => {
    setIsloading(true)
    switch (provider_name) {
      case 'google':
        {
          // console.log("check uri ", email, accessToken)
          const res = await PostServerCall(`/google-ads-apis/ObtainAdsData`, { email, customer_ids, accessToken, manager_id })
          handleResponse(res, provider_name, user_name)
          // close buttons popup in google case 
          handleOk()
        }
        break;

      case 'facebook':
        {
          const res = await GetServerCall(`/meta-ads/ObtainMetaAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name, user_name)
        }
        break

      case 'bing':
        {
          const res = await GetServerCall(`/bing-ads/ObtainBingAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name, user_name)
        }
        break
      case 'linkedin':
        {
          const res = await GetServerCall(`/linkedin-ads/ObtainLinkedinAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name, user_name)
        }
        break
      default:
        break;
    }

  };

  const handleResponse = (res, provider_name, user_name) => {
    let id = localStorage.getItem('id')
    if (res.data.err) {
      let is_sync_users_with_ads = JSON.parse(localStorage.getItem('is_sync_users_with_ads')) || {};
      is_sync_users_with_ads = { ...is_sync_users_with_ads, [id]: { ...is_sync_users_with_ads[id], [provider_name]: false } };
      localStorage.setItem("is_sync_users_with_ads", JSON.stringify(is_sync_users_with_ads));
    }
    else {
      let is_sync_users_with_ads = JSON.parse(localStorage.getItem('is_sync_users_with_ads')) || {}
      if (is_sync_users_with_ads[id])
        is_sync_users_with_ads[id].provider_name = !is_sync_users_with_ads[id].provider_name;

      localStorage.setItem("is_sync_users_with_ads", JSON.stringify(is_sync_users_with_ads));
    }
    let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
    logedInUsers[id] = {
      ...logedInUsers[id],
      [provider_name]: { name: user_name }
    }
    localStorage.setItem("LOGED_IN_USERS", JSON.stringify(logedInUsers));
    setShowClientLinkedActsModal(true);
    setCurrentProvider(provider_name)
    getdata()
  }


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "",
      dataIndex: "Link",
      key: "Link",
      render: (text, record) => <a onClick={() => {
        localStorage.setItem('id', record.id)
        setEmail(record.email)

        showModal(record);
      }}>{text}</a>,
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "Client",
    },
    {
      title: "Total Over/Under",
      dataIndex: "total",
      key: "TotalOverUnder",
      render: (text) => '$' + parseInt(text).toLocaleString()
    },
    {
      title: "Monthly Budget",
      dataIndex: "monthly_budget",
      key: "MonthlyBudget",
      render: (text) => '$' + parseInt(text).toLocaleString()
    },
    {
      title: "Month-to-Date Spent",
      dataIndex: "monthly_spent",
      key: "Month_to_DateSpent",
      render: (text) => '$' + parseInt(text).toLocaleString()
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "Remaining",
      render: (text) => '$' + parseInt(text).toLocaleString()
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "Status",
      render: (val, arg) => {
        let color = "green";
        if (val === "Take Action" || val === "Over budget") {
          color = "red";
        } else if (val === "Good") {
          color = "green";
        } else if (val === "Monitor") {
          color = "orange";
        }
        return (
          <Tag color={color} key={val}>
            {val}
          </Tag>
        );
      },
    },
    {
      title: "Google",
      dataIndex: "google",
      key: "Google",
      render: (val, obj) => {
        let is_sync_users_with_ads = JSON.parse(localStorage.getItem('is_sync_users_with_ads')) || {}
        let is_sync = is_sync_users_with_ads[obj.id] || {}
        // console.log("check incuse ", obj)
        if (is_sync.google == false) {
          return (<> {'$' + parseInt(val).toLocaleString()}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return '$' + parseInt(val).toLocaleString()
        }
      },
    },
    {
      title: "Bing",
      dataIndex: "bing",
      key: "Bing",
      render: (val, obj) => {
        let is_sync_users_with_ads = JSON.parse(localStorage.getItem('is_sync_users_with_ads')) || {}
        let is_sync = is_sync_users_with_ads[obj.id] || {}
        if (is_sync.bing == false) {
          return (<>{'$' + parseInt(val).toLocaleString()}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return '$' + parseInt(val).toLocaleString()
        }
      },
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedin",
      key: "LinkedIn",
      render: (val, obj) => {
        let is_sync_users_with_ads = JSON.parse(localStorage.getItem('is_sync_users_with_ads')) || {}
        let is_sync = is_sync_users_with_ads[obj.id] || {}
        if (is_sync.linkedin == false) {
          return (<>{'$' + parseInt(val).toLocaleString()}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return '$' + parseInt(val).toLocaleString()
        }
      },
    },
    {
      title: "Meta",
      dataIndex: "facebook",
      key: "Facebook",
      render: (val, obj) => {
        let is_sync_users_with_ads = JSON.parse(localStorage.getItem('is_sync_users_with_ads')) || {}
        let is_sync = is_sync_users_with_ads[obj.id] || {}
        if (is_sync.facebook == false) {
          return (<>{'$' + parseInt(val).toLocaleString()}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return '$' + parseInt(val).toLocaleString()
        }
      },
    }
  ];
  // console.log('rendered')
  const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;
  let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
  let id = localStorage.getItem('id')
  let userExist = logedInUsers[id]

  return (
    <Fragment>
      <Spin tip="Loading..." indicator={antIcon} spinning={isloading} size="large" style={{ marginLeft: '2vw' }}>
        <div className="TableMain">
          <Table
            style={{ height: "auto" }}
            className="adviewTable"
            columns={columns}
            dataSource={tableData}
          />
          {!isloading && tableData.length == 0 ? <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '4vw' }} >
            {<Button onClick={() => { getdata() }}>Retry</Button>}
          </div> : ''}

        </div>
      </Spin>

      <Modal
        title={userExist?.google?.name ? `Link Account to ${userExist?.google?.name}` : "Link Accounts to GoldenGate Partners"}
        width={"55%"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <div style={{ display: 'flex', gap: '2%', marginTop: '20px' }}>
            <GoogleBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
            <BingBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
            <LinkedinBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
            <Facebook fetchAdsData={fetchAdsData} handleOk={handleOk} />
          </div>
          <LinkedAccountsToClient showClientLinkedActsModal={showClientLinkedActsModal} setshowModal={setShowClientLinkedActsModal} currentProvider={currentProvider} userData={tableData.find(e => e.email == email)} refreshData={getdata} isMainLoading={isloading} />
        </div>
      </Modal>
    </Fragment>
  );
};

export default AdviewTable;
