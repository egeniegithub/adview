import React, { Fragment, useState, useEffect } from "react";
import { Table, Tag, Button, Modal } from "antd";
import axios from "axios";
import {
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons/lib/icons";
import "../styles/table.css";

import { loginWithBing } from "../Services/bingAuth";
import { LinkedinBtn } from "./Linkdin";
import { BingBtn } from "./BingBtn";
import { Facebook } from "./Facebook";
import { getBubbleUsers } from "../Services/BubbleIo";
import { GoogleBtn } from "./GoogleBtn";
import { GetServerCall } from "../Services/apiCall";

const AdviewTable = () => {
  const [AccessToken, setAccessToken] = useState("");
  const [RefreshToken, setRefreshToken] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [dataStatus, setdataStatus] = useState(false);
  const [currentRow, setcurrentRow] = useState({ id: '', name: '' })

  useEffect(() => {
    const getdata = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/client-data`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        data[i]["key"] = i + 1;
        data[i]["Link"] = "Link";
      }
      setTableData(data)
      console.log(data);
      const bubble = await getBubbleUsers()
      console.log("check bubble response ", bubble)
    }
    getdata()
  }, [])

  const modifyData = (tableData, data) => {
    const modified = [];
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].email === data[0].email) {
        tableData[i].Google = data[0].Google ? data[0].Google : "-";
        tableData[i].updation_status = data[0].updation_status
          ? data[0].updation_status
          : "";
        modified.push(tableData);
        console.log(modified, "modified");
      } else {
        modified.push(tableData);
      }
    }
  };

  const fetchAdsData = async (accessToken, provider_name) => {
    switch (provider_name) {
      case 'google':
        {
          console.log("check uri ", email, accessToken)
          const res = await GetServerCall(`/google-ads-apis/ObtainAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name)
        }
        break;

      case 'facebook':
        {
          const res = await GetServerCall(`/meta-ads/ObtainMetaAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name)
        }
        break

      case 'bing':
        {
          const res = await GetServerCall(`/bing-ads/ObtainBingAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name)
        }
        break
      case 'linkedin':
        {
          const res = await GetServerCall(`/linkedin-ads/ObtainLinkedinAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name)
        }
        break
      default:
        break;
    }

  };

  const handleResponse = (res, provider_name) => {
    let tempArry = [...tableData]
    if (res.data.err) {
    for (let index = 0; index < tempArry.length; index++) {
      const item = tempArry[index];
      if (item.id === currentRow.id && res.data.updation_status == false){
        let temp = item.include? [...item.include,provider_name] : [provider_name]
        tempArry[index] = { ...item,
          'isStatusUpdated': false,
          'include': [...temp]}
      }
    }
    }
    else {
      for (let index = 0; index < tempArry.length; index++) {
        const item = tempArry[index];
        if (item.id === currentRow.id){
          tempArry[index] = { ...item, [provider_name]: res.data?.calculated?.amount_spent }
        }
      }
    }
    setTableData(tempArry)
  }

  const storetoken = async (email, accessToken, refreshToken) => {
    try {
      let res = await axios.post(`${process.env.REACT_APP_API_URL}/google-ads-apis/plateformTokens`, {
        email: email,
        g_token: accessToken,
        g_refresh: refreshToken,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (res)
        fetchAdsData(email);

    } catch (error) {
      console.log(error, "error");
    }
  };


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
        if (currentRow.name) {
          setcurrentRow({ id: '', name: '' })
        }
        setEmail(record.email)
        setcurrentRow({ ...currentRow, id: record.id })
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
    },
    {
      title: "Monthly Budget",
      dataIndex: "monthly_budget",
      key: "MonthlyBudget",
    },
    {
      title: "Month-to-Date Spent",
      dataIndex: "monthly_spent",
      key: "Month_to_DateSpent",
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "Remaining",
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
        console.log("check incuse ", obj)
        if (obj?.isStatusUpdated == false && obj?.include?.includes('google')) {
          return (<>{val}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return val
        }
      },
    },
    {
      title: "Bing",
      dataIndex: "bing",
      key: "Bing",
      render: (val, obj) => {
        if (obj?.isStatusUpdated == false && obj?.include?.includes('bing')) {
          return (<>{val}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return val
        }
      },
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedin",
      key: "LinkedIn",
      render: (val, obj) => {
        if (obj?.isStatusUpdated == false && obj?.include?.includes('linkedin')) {
          return (<>{val}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return val
        }
      },
    },
    {
      title: "Facebook",
      dataIndex: "facebook",
      key: "Facebook",
      render: (val, obj) => {
        if (obj?.isStatusUpdated == false && obj?.include?.includes('facebook')) {
          return (<>{val}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return val
        }
      },
    },
    {
      title: "Instagram",
      dataIndex: "instagram",
      key: "Instagram",
      render: (val, obj) => {
        if (obj?.isStatusUpdated == false && obj?.include?.includes('facebook')) {
          return (<>{val}  <WarningOutlined style={{ color: "red" }} /></>)
        } else {
          return val
        }
      },
    },
  ];

  return (
    <Fragment>
      <div className="TableMain">
        <Table
          style={{ height: "auto" }}
          className="adviewTable"
          columns={columns}
          dataSource={tableData}
        />
      </div>
      <Modal
        title="Link Accounts to client"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ display: 'flex' }}>
          <GoogleBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
          <BingBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
          <LinkedinBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
          <Facebook fetchAdsData={fetchAdsData} handleOk={handleOk} />
        </div>

      </Modal>
    </Fragment>
  );
};

export default AdviewTable;
