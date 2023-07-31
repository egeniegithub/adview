import React, { Fragment, useState, useEffect } from "react";
import { Table, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons/lib/icons";
import "../styles/table.css";
import { activeClients } from "../Services/AdviewTables.js";
import { RenderRetryBtn } from "./Common/RetryBtn";
import { adviewTableColumns } from "./Common/TableColumns";

const AdViewTable = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timerCount, setTimerCount] = useState(0);
  const [notify, contextHolder] = notification.useNotification();
  useEffect(() => {
    getData();
  }, []);

  // refresh data after 2 sec must track api calls to prevent infinite calls
  useEffect(() => {
    let timer;
    if (!isLoading && tableData.length === 0 && timerCount < 10)
      timer = setTimeout(() => {
        getData();
        let t = timerCount;
        setTimerCount(t + 1);
      }, 5000);
    return () => clearTimeout(timer);
  }, [isLoading, tableData]);

  const getData = async () => {
    setIsLoading(true);
    try {
      let data =await activeClients()
      setTableData(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify.error({
        description: "Internal Server Error",
      });
    }
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 22 }} spin />;

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
            columns={adviewTableColumns}
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
      {contextHolder}
    </Fragment>
  );
};

export default AdViewTable;
