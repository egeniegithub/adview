import React, { Fragment, useState, useEffect, cloneElement } from "react";
import { Table, Modal, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import "../styles/table.css";

import { LinkedinBtn } from "./SocialButtons/Linkedin";
import { BingBtn } from "./SocialButtons/BingBtn";
import { Facebook } from "./SocialButtons/Facebook";
import { GoogleBtn } from "./SocialButtons/GoogleBtn";
import { LinkedAccountsToClient } from "./LinkedAccountsToClient";
import { RenderRetryBtn } from "./Common/RetryBtn";
import { AccountsTableColumns } from "./Common/TableColumns";

import {FetchAds, clientData } from "../Services/AdviewTables";

const SocialButtons = [
  {
    component: <GoogleBtn />,
  },
  {
    component: <BingBtn />,
  },
  {
    component: <LinkedinBtn />,
  },
  {
    component: <Facebook />,
  },
];

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
      const data = await clientData();
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
    FetchAds(
      accessToken,
      provider_name,
      email,
      customer_ids,
      manager_id,
      handleOk,
      getData,
      notify
    );
  };

  const showModal = () => setIsModalOpen(true);

  const handleOk = () => setIsModalOpen(false);

  const handleCancel = () => setIsModalOpen(false);

  const columns = AccountsTableColumns(setEmail, showModal);

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
            <RenderRetryBtn getData={getData} />
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
            {SocialButtons.map((ele) => {
              let { component } = ele;
              let user = tableData.find((e) => e.email === email);
              return cloneElement(component, {
                fetchAdsData: fetchAdsData,
                handleOk: handleOk,
                getData: getData,
                userData: user,
                notify: notify,
              });
            })}
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
