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
import { GetServerCall } from "../Services/apiCall";
import { getAccosiatedUstomers } from "../Services/googleLinkedUsers";

const AdviewTable = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsloading] = useState(true)
  const [linkedUsers, setLinkedUsers] = useState([])
  const [showLinkedUserModal, setshowLinkedUserModal] = useState(false)

  useEffect(() => {
    getdata()
  }, [])

  const getdata = async () => {
    setIsloading(true)
    try {
      const response = await GetServerCall(`/client-data`)
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        data[i]["key"] = i + 1;
        data[i]["Link"] = "Link";
      }
      setTableData(data)
      setIsloading(false)
    } catch (error) {
      setIsloading(false)
    }
    const bubble = await getBubbleUsers()
    console.log("check bubble response ", bubble)
  }

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

  const fetchAdsData = async (accessToken, provider_name,user_name) => {
    switch (provider_name) {
      case 'google':
        {
          console.log("check uri ", email, accessToken)
          const res = await GetServerCall(`/google-ads-apis/ObtainAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name,user_name)
          let list =await getAccosiatedUstomers(accessToken)
          if(list?.length){
            setLinkedUsers(list)
            setshowLinkedUserModal(true)
          }
          // close buttons popup in google case 
          handleOk()
        }
        break;

      case 'facebook':
        {
          const res = await GetServerCall(`/meta-ads/ObtainMetaAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name,user_name)
        }
        break

      case 'bing':
        {
          const res = await GetServerCall(`/bing-ads/ObtainBingAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name,user_name)
        }
        break
      case 'linkedin':
        {
          const res = await GetServerCall(`/linkedin-ads/ObtainLinkedinAdsData/${email}/${accessToken}`)
          handleResponse(res, provider_name,user_name)
        }
        break
      default:
        break;
    }

  };

  const handleResponse = (res, provider_name,user_name) => {
    let id = localStorage.getItem('id')
    if (res.data.err) {
      setTableData(prevArray =>
        prevArray.map(item => {
          // check if data isnt updated then indicator should show 
          if (item.id == id && res.data.updation_status == false) {
            let temp = item.include? [...item.include,provider_name] : [provider_name]
            return {
              ...item,
              'isStatusUpdated': false,
              'include': [...temp]
            };
          }
          else
            return { ...item };
        })
      );
    }
    else {
      setTableData(prevArray =>
        prevArray.map(item => {
          if (item.id == id) {
            if(provider_name =='facebook')
              return { ...item, [provider_name]: res.data?.calculated?.amount_spent,
                ['instagram']: res.data?.calculated?.amount_spent };
            return { ...item, [provider_name]: res.data?.calculated?.amount_spent };
          }
          else
            return { ...item };
        })
      )}
      let logedInUsers = JSON.parse(localStorage.getItem('LOGED_IN_USERS')) || {}
        logedInUsers[id] = {
          ...logedInUsers[id],
          [provider_name]:{name :user_name}
        }
      localStorage.setItem("LOGED_IN_USERS", JSON.stringify(logedInUsers));

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

  const handleCustomerSelection = (userData)=>{
    console.log("check customer ", userData)
    setshowLinkedUserModal(false)
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
        localStorage.setItem('id',record.id)
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
  console.log('rendered')
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <Fragment>
      <Spin tip="Loading..." indicator={antIcon} spinning={isloading} size="large" style={{marginLeft:'2vw'}}>
        <div className="TableMain">
          <Table
            style={{ height: "auto" }}
            className="adviewTable"
            columns={columns}
            dataSource={tableData}
          />
          {!isloading && tableData.length == 0 ?<div style={{display:'flex',justifyContent:'center',marginLeft:'4vw'}} >
            <Button onClick={()=>{getdata()}}>Retry</Button>
          </div>:''}
          
        </div>
      </Spin>
      
      <Modal
        title="Link Accounts to client"
        width={"55%"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ display: 'flex',gap:'2%',marginTop:'20px' }}>
          <GoogleBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
          <BingBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
          <LinkedinBtn fetchAdsData={fetchAdsData} handleOk={handleOk} />
          <Facebook fetchAdsData={fetchAdsData} handleOk={handleOk} />
        </div>
      </Modal>

      <Modal
        title="Linked Accounts"
        width={"55%"}
        open={showLinkedUserModal}
        onOk={()=>{setshowLinkedUserModal(false)}}
        closable = {false}
        footer={<Button onClick={()=>{setshowLinkedUserModal(false)}}>Ok</Button>}
      >
        <Table
            style={{ height: "auto" }}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {console.log("row clicked ", record)}, // click row
              };
            }}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                key: "id",
              },
              {
                title: "Name",
                dataIndex: "descriptiveName",
                key: "descriptiveName",
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
              },
            ]}
            dataSource={linkedUsers}
          />
        {/* <div style={{ display: 'flex',flexFlow:'column',gap:'2%' }}>
          {linkedUsers.map((e,indx)=>{
            return(
              <p onClick={()=> handleCustomerSelection(e)} style={{cursor:'pointer',width:'fit-content'}} key={e.id}>
                {indx+1})&nbsp; <strong>ID:</strong> {e.id}, <strong>Name:</strong> {e.descriptiveName}  <strong>status:</strong> {e.status== 'CLOSED'? 'Disabled': 'Enable'}
              </p>
            )
          })}
        </div> */}

      </Modal>
    </Fragment>
  );
};

export default AdviewTable;
