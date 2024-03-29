import { Button, Input, Space, Spin, Table, Tag } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { FilterFilled, LoadingOutlined, WarningOutlined } from "@ant-design/icons";
import { underOverData } from "../Services/AdviewTables";

const MonthlyLogTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      let data = await underOverData()
      setList(data || []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const columns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
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
      title: "Account",
      dataIndex: "client",
      key: "client",
      sorter: (a, b) => a.client.length - b.client.length,
      onFilter: (value, record) =>
        record.client
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
      filterIcon: (filtered) => <FilterFilled />,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Filter Account"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setSelectedKeys([]); // Clear selected keys
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
    },

    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyer",
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
      title: "Budget",
      dataIndex: "monthly_budget",
      key: "monthly_budget",
      render: (text) =>
        text > 0 ? "$" + parseInt(text).toLocaleString() : "-",
      sorter: (a, b) => a.monthly_budget - b.monthly_budget,
    },
    {
      title: "Spend",
      dataIndex: "monthly_spent",
      key: "monthly_spent",
      render: (text) =>
        text > 0 ? "$" + parseInt(text).toLocaleString() : "-",
      sorter: (a, b) => a.monthly_spent - b.monthly_spent,
    },
    // {
    //   title: "Under/Over",
    //   dataIndex: "remaining",
    //   key: "remaining",
    //   render: (text) => {
    //     let color = text > 0 ? 'green' :'red'
    //     return !isNaN(text) ? (
    //       <Tag color={color} key={text}>
    //         {parseInt(text) < 0 ? '-' : ''}${Math.abs(parseInt(text)).toLocaleString()}
    //       </Tag>
    //     ) : (
    //       "-"
    //     );
    //   },
    //   sorter: (a, b) => a.remaining - b.remaining,
    // },
    {
      title: "Under/Over",
      dataIndex: "remaining",
      key: "remaining",
      render: (text) => {
        let color = text > 0 ? 'green' :text === 0 ? 'orange': 'red'
        return !isNaN(text) ? (
          <Tag color={color} key={text}>
            {parseInt(text) > 0 ? 'Under' :text === 0 ? 'No Over/Under': 'Over'}
          </Tag>
        ) : (
          "-"
        );
      },
      sorter: (a, b) => a.remaining - b.remaining,
      filters: [
        {
          text: "Over",
          value: "Over",
        },
        {
          text: "Under",
          value: "Under",
        },
        {
          text: "No Over/Under",
          value: "No Over/Under",
        }
      ],
      onFilter: (value, record) => {
        if (value === "Over") {
          return record.remaining < 0;
        } else if (value === "Under") {
          return record.remaining > 0;
        } else if (value === "No Over/Under") {
          return record.remaining === 0;
        }
        return false; // Handle unexpected filter values
      },
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
            dataSource={list}
            pagination={false}
          />
        </div>
      </Spin>
    </Fragment>
  );
};

export default MonthlyLogTable;

