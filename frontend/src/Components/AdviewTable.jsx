import React, { Fragment, useState, useEffect } from "react";
import { Table, Tag, Button, Modal } from "antd";
import axios from "axios";
import {
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons/lib/icons";
import "../styles/table.css";

import {
  auth,
  signInWithPopup,
  GoogleAuthProvider,
  googleProvider,
} from "../Config";
import { loginWithBing } from "../Services/bingAuth";
import { LinkedinBtn } from "./Linkdin";
import { BingBtn } from "./BingBtn";
import { Facebook } from "./Facebook";
import { getBubbleUsers } from "../Services/BubbleIo";

const AdviewTable = () => {
  const [AccessToken, setAccessToken] = useState("");
  const [RefreshToken, setRefreshToken] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [dataStatus, setdataStatus] = useState(false);

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

  const fetchAdsData = async (email) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/google-ads-apis/ObtainAdsData/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      const updateStatus = data[0].updation_status;
      setClientData(data);
      setdataStatus(updateStatus);
      modifyData(tableData, data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateClientData = async (email, accessToken, refreshToken) => {
    console.log(email, "email");
    try {
      let res = await axios.patch(`${process.env.REACT_APP_API_URL}/google-ads-apis/AdsData`, {
        email: email,
        g_token: accessToken,
        g_refresh: refreshToken,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchAdsData(email);
    } catch (error) {
      console.error(error);
    }
  };

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
        updateClientData(email, accessToken, refreshToken);

    } catch (error) {
      console.log(error, "error");
    }
  };

  const loginWithGoogle = async (e) => {
    e.preventDefault();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        //const accessToken = credential?.accessToken;
        const accessToken = result?._tokenResponse?.oauthIdToken;
        const refreshToken = result?._tokenResponse?.refreshToken;
        const email = result?.user?.email;
        console.log(result, "res");
        console.log(accessToken, "token");
        // const email = result.user.email;
        // const fullName = result.user.displayName;
        if (accessToken && refreshToken) {
          setAccessToken(AccessToken);
          setRefreshToken(refreshToken);
          setEmail(email);
          // storetoken(email, accessToken, refreshToken);
          handleOk();
        }
        handleOk();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return {
          errorCode,
          errorMessage,
        };
      });
  };

  // const handleLoginWithBing = async () => {
  //   const authResult = await loginWithBing();
  //   console.log(authResult, "adviewtablefile");
  // };

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
      render: (text, record) => <a onClick={() => showModal(record)}>{text}</a>,
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
      render: (val, { Status }) => {
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
      // render: (val, obj) => {
      //   if (obj.updation_status == "" || obj.updation_status == true) {
      //     return val;
      //   } else if (obj.updation_status == false) {
      //     return val + <WarningOutlined style={{ color: "red" }} />;
      //   }
      // },
    },
    {
      title: "Bing",
      dataIndex: "bing",
      key: "Bing",
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedin",
      key: "LinkedIn",
    },
    {
      title: "Facebook",
      dataIndex: "facebook",
      key: "Facebook",
    },
    {
      title: "Instagram",
      dataIndex: "instagram",
      key: "Instagram",
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
          <Button className="ModalBtn" type="primary" onClick={loginWithGoogle}>
            Google Ads
          </Button>
          <BingBtn />
          <LinkedinBtn />
          <Facebook />
        </div>

      </Modal>
    </Fragment>
  );
};

export default AdviewTable;
