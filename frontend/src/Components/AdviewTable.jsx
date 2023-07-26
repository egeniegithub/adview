import React, { Fragment, useState, useEffect } from "react";
import { Table, Tag, Button, Spin, notification } from "antd";
import { WarningOutlined, LoadingOutlined } from "@ant-design/icons/lib/icons";
import "../styles/table.css";

import { GetServerCall } from "../Services/apiCall";
import { getStatus } from "../utils/helper";

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
      const response = await GetServerCall(`/client-data/actives`);
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        let { facebook = 0, bing = 0, linkedin = 0, google = 0 } = data[i];
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

  const columns = [
    {
      title: "Client",
      dataIndex: "client",
      key: "Client",
      sorter: (a, b) => a.client.length - b.client.length,
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "Buyer",
      filters: [
        {
          text: "Agency",
          value: "Agency",
        },
        {
          text: "Client",
          value: "Client",
        },
      ],
      onFilter: (value, record) => record.buyer.indexOf(value) === 0,
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "Frequency",
      filters: [
        {
          text: "Month-to-Month",
          value: "Month-to-Month",
        },
        {
          text: "One-Time",
          value: "One-Time",
        },
      ],
      onFilter: (value, record) => record.frequency.indexOf(value) === 0,
    },
    {
      title: "Over/Under",
      dataIndex: "remaining",
      key: "TotalOverUnder",
      render: (text) =>
        text > 0 ? (
          "$" + parseInt(text).toLocaleString()
        ) : (
          <p style={{ color: `red` }}>${parseInt(text).toLocaleString()}</p>
        ),
      sorter: (a, b) => a.remaining - b.remaining,
      // onFilter: (value, record) => record.remaining.toString().startsWith(value.toString()),
      // filterIcon: filtered => <SearchOutlined className="ant-table-filter-icon" />,
      // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       placeholder="Filter Over/Under"
      //       value={selectedKeys[0]}
      //       onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      //       onPressEnter={() => confirm()}
      //       style={{ width: 188, marginBottom: 8, display: 'block' }}
      //     />
      //     <Space>
      //       <Button
      //         type="primary"
      //         onClick={() => confirm()}
      //         size="small"
      //         style={{ width: 90 }}
      //       >
      //         Filter
      //       </Button>
      //       <Button onClick={() => {
      //         clearFilters();
      //         setSelectedKeys([]); // Clear selected keys
      //         confirm();
      //       }} size="small" style={{ width: 90 }}>
      //         Reset
      //       </Button>
      //     </Space>
      //   </div>
      // ),
    },
    {
      title: "Monthly Budget",
      dataIndex: "monthly_budget",
      key: "MonthlyBudget",
      render: (text) =>
        text > 0 ? "$" + parseInt(text).toLocaleString() : "-",
      sorter: (a, b) => a.monthly_budget - b.monthly_budget,
    },
    {
      title: "Month-to-Date Spent",
      dataIndex: "monthly_spent",
      key: "Month_to_DateSpent",
      render: (text) =>
        text > 0 ? "$" + parseInt(text).toLocaleString() : "-",
      sorter: (a, b) => a.monthly_spent - b.monthly_spent,
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "Remaining",
      render: (text) =>
        text > 0 ? "$" + parseInt(text).toLocaleString() : "-",
      sorter: (a, b) => a.remaining - b.remaining,
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
      sorter: (a, b) => a.status.length - b.status.length,
      filters: [
        {
          text: "Good",
          value: "Good",
        },
        {
          text: "Monitor",
          value: "Monitor",
        },
        {
          text: "Take Action",
          value: "Take Action",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Google",
      dataIndex: "google",
      key: "Google",
      render: (val, obj) => {
        let is_sync_users_with_ads =
          JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
        let is_sync = is_sync_users_with_ads[obj.id] || {};
        // console.log("check incuse ", obj)
        if (is_sync.google === false) {
          return (
            <>
              {" "}
              {"$" + parseInt(val).toLocaleString()}{" "}
              <WarningOutlined style={{ color: "red" }} />
            </>
          );
        } else {
          return val > 0 ? "$" + parseInt(val).toLocaleString() : "-";
        }
      },
      sorter: (a, b) => a.google - b.google,
    },
    {
      title: "Bing",
      dataIndex: "bing",
      key: "Bing",
      render: (val, obj) => {
        let is_sync_users_with_ads =
          JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
        let is_sync = is_sync_users_with_ads[obj.id] || {};
        if (is_sync.bing === false) {
          return (
            <>
              {"$" + parseInt(val).toLocaleString()}{" "}
              <WarningOutlined style={{ color: "red" }} />
            </>
          );
        } else {
          return val > 0 ? "$" + parseInt(val).toLocaleString() : "-";
        }
      },
      sorter: (a, b) => a.bing - b.bing,
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedin",
      key: "LinkedIn",
      render: (val, obj) => {
        let is_sync_users_with_ads =
          JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
        let is_sync = is_sync_users_with_ads[obj.id] || {};
        if (is_sync.linkedin === false) {
          return (
            <>
              {"$" + parseInt(val).toLocaleString()}{" "}
              <WarningOutlined style={{ color: "red" }} />
            </>
          );
        } else {
          return val > 0 ? "$" + parseInt(val).toLocaleString() : "-";
        }
      },
      sorter: (a, b) => a.linkedin - b.linkedin,
    },
    {
      title: "Meta",
      dataIndex: "facebook",
      key: "Facebook",
      render: (val, obj) => {
        let is_sync_users_with_ads =
          JSON.parse(localStorage.getItem("is_sync_users_with_ads")) || {};
        let is_sync = is_sync_users_with_ads[obj.id] || {};
        if (is_sync.facebook === false) {
          return (
            <>
              {"$" + parseInt(val).toLocaleString()}{" "}
              <WarningOutlined style={{ color: "red" }} />
            </>
          );
        } else {
          return val > 0 ? "$" + parseInt(val).toLocaleString() : "-";
        }
      },
      sorter: (a, b) => a.facebook - b.facebook,
    },
  ];
  // console.log('rendered')
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
      {contextHolder}
    </Fragment>
  );
};

export default AdViewTable;
