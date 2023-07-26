import React, { Fragment, useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import "../styles/table.css";

import { LinkedinBtn } from "./Linkedin";
import { BingBtn } from "./BingBtn";
import { Facebook } from "./Facebook";
import { GoogleBtn } from "./GoogleBtn";
import { GetServerCall, PostServerCall } from "../Services/apiCall";
import { LinkedAccountsToClient } from "./LinkedAccountsToClient";
import { getStatus } from "../utils/helper";

const AccountsTable = () => {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClientLinkedActsModal, setShowClientLinkedActsModal] =
    useState(false);
  const [timerCount, setTimerCount] = useState(0);
  const [notify, contextHolder] = notification.useNotification();
  useEffect(() => {
    getData();
  }, []);

  // refresh data after 2 sec must track api calls to prevent infinite calls
  useEffect(() => {
    let timer;
    if (!isLoading && tableData.length === 0 && timerCount < 30)
      timer = setTimeout(() => {
        getData();
        let t = timerCount;
        setTimerCount(t + 1);
      }, 2000);
    return () => clearTimeout(timer);
  }, [isLoading, tableData]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await GetServerCall(`/client-data`);
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        let {
          facebook = 0,
          bing = 0,
          linkedin = 0,
          google = 0,
          email,
        } = data[i];
        if (!email) continue;
        data[i]["key"] = i + 1;
        data[i]["Link"] = "Link";
        data[i].monthly_spent =
          (facebook > 0 ? parseInt(facebook) : 0) +
          (google > 0 ? parseInt(google) : 0) +
          (bing > 0 ? parseInt(bing) : 0) +
          (linkedin > 0 ? parseInt(linkedin) : 0);
        data[i].remaining =
          parseInt(data[i].monthly_budget) - data[i].monthly_spent;
        data[i].status = getStatus(data[i].remaining);
      }
      setTableData(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify.error({
        description: "Internal Server Error",
      });
    }
  };

  const fetchAdsData = async (
    accessToken,
    provider_name,
    user_name,
    customer_ids,
    manager_id,
    linkedinCode
  ) => {
    // manager_id can be have different value
    setIsLoading(true);
    switch (provider_name) {
      case "google":
        {
          let { refresh_token, access_token } = accessToken;
          // console.log("check uri ", email, accessToken)
          const res = await PostServerCall(`/google-ads-apis/ObtainAdsData`, {
            email,
            customer_ids,
            access_token,
            manager_id,
            refresh_token,
          });
          handleResponse(res, provider_name, user_name);
          // close buttons popup in google case
          handleOk();
        }
        break;

      case "facebook":
        {
          let { refresh_token, access_token } = accessToken;
          const res = await PostServerCall(`/meta-ads/ObtainMetaAdsData`, {
            email,
            customer_ids,
            access_token,
            customer_names: manager_id,
            refresh_token,
          });
          handleResponse(res, provider_name, user_name);
          handleOk();
        }
        break;

      case "bing":
        {
          let { refresh_token, access_token } = accessToken;
          const res = await PostServerCall(`/bing-ads/ObtainBingAdsData`, {
            email,
            customer_ids,
            access_token,
            refresh_token,
            customer_names: manager_id,
          });
          handleResponse(res, provider_name, user_name);
          handleOk();
        }
        break;
      case "linkedin":
        {
          let { refresh_token, access_token } = accessToken;
          const res = await PostServerCall(
            `/linkedin-ads/ObtainLinkedinAdsData`,
            {
              email,
              customer_ids,
              refresh_token,
              access_token,
              customer_names: manager_id,
            }
          );
          handleResponse(res, provider_name, user_name);
          handleOk();
        }
        break;
      default:
        break;
    }
  };

  const handleResponse = (res, provider_name) => {
    let id = localStorage.getItem("id");
    if (res.data.err) {
      let is_sync_users_with_ads =
        JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
      is_sync_users_with_ads = {
        ...is_sync_users_with_ads,
        [id]: { ...is_sync_users_with_ads[id], [provider_name]: false },
      };
      localStorage.setItem(
        "is_sync_users_with_ads",
        JSON.stringify(is_sync_users_with_ads)
      );
      notify.error({
        description: "Error in Ads api",
      });
    } else {
      let is_sync_users_with_ads =
        JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
      if (is_sync_users_with_ads[id])
        is_sync_users_with_ads[id].provider_name =
          !is_sync_users_with_ads[id].provider_name;
      localStorage.setItem(
        "is_sync_users_with_ads",
        JSON.stringify(is_sync_users_with_ads)
      );
      notify.success({
        description: "Updated",
      });
    }
    setShowClientLinkedActsModal(true);
    getData();
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
      title: "Client",
      dataIndex: "client",
      key: "Client",
      width: "40%",
    },
    {
      title: "Action",
      dataIndex: "Link",
      key: "Link",
      width: "30%",
      render: (text, record) => (
        <p
          style={{ color: "#1677ff", cursor: "pointer" }}
          onClick={() => {
            localStorage.setItem("id", record.id);
            setEmail(record.email);
            showModal(record);
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Account Status",
      dataIndex: "is_active_from_bubble",
      width: "30%",
      key: "Status",
      render: (val, arg) => {
        let color = "green";
        if (val === "0") color = "red";
        return (
          <Tag color={color} key={val}>
            {val === "1" ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
  ];
  // console.log('rendered')
  const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;

  const getUserName = () => {
    let { client } = tableData.find((e) => e.email === email) || {};
    return client;
  };

  return (
    <Fragment>
      <Spin
        tip="Loading..."
        indicator={antIcon}
        spinning={isLoading}
        size="large"
        style={{ marginLeft: "2vw" }}
      >
        <div className="TableMain">
          <Table
            style={{ height: "auto" }}
            scroll={{ x: 900 }}
            className="adViewTable"
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
          {!isLoading && tableData.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginLeft: "4vw",
              }}
            >
              {
                <Button
                  style={{ width: "10vh" }}
                  onClick={() => {
                    getData();
                  }}
                >
                  Retry
                </Button>
              }
            </div>
          ) : (
            ""
          )}
        </div>
      </Spin>
      <Modal
        title={`Link Accounts to ${getUserName()}`}
        width={"100%"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="responsive_warper"
      >
        <div style={{ display: "flex", flexFlow: "column" }}>
          <div className="buttons_wrapper">
            <GoogleBtn
              fetchAdsData={fetchAdsData}
              handleOk={handleOk}
              getData={getData}
              userData={tableData.find((e) => e.email === email)}
              notify={notify}
            />
            <BingBtn
              fetchAdsData={fetchAdsData}
              handleOk={handleOk}
              getData={getData}
              userData={tableData.find((e) => e.email === email)}
              notify={notify}
            />
            <LinkedinBtn
              fetchAdsData={fetchAdsData}
              handleOk={handleOk}
              getData={getData}
              userData={tableData.find((e) => e.email === email)}
              notify={notify}
            />
            <Facebook
              fetchAdsData={fetchAdsData}
              handleOk={handleOk}
              getData={getData}
              userData={tableData.find((e) => e.email === email)}
              notify={notify}
            />
          </div>
          <LinkedAccountsToClient
            showClientLinkedActsModal={showClientLinkedActsModal}
            setShowModal={setShowClientLinkedActsModal}
            userData={tableData.find((e) => e.email === email)}
            refreshData={getData}
            isMainLoading={isLoading}
          />
        </div>
      </Modal>
      {contextHolder}
    </Fragment>
  );
};

export default AccountsTable;
