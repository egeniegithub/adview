import { Button, Input, Space, Spin, Table, Tag } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { GetServerCall } from "../Services/apiCall";
import { FilterFilled, LoadingOutlined } from "@ant-design/icons";

const UnderOverTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await GetServerCall(
        `/client-data/get-monthly-clients-data`
      );
      if (!response.data.error) {
        let data = response.data.list || [];
        for (let i = 0; i < data.length; i++) {
          data[i]["key"] = i + 1;
          data[i].month = monthNames[data[i].month - 1];
        }
        setList(data || []);
      }
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
    {
      title: "Under/Over",
      dataIndex: "remaining",
      key: "remaining",
      render: (text) => {
        let color = text > 0 ? 'green' :'red'
        return !isNaN(text) ? (
          <Tag color={color} key={text}>
            $ {parseInt(text).toLocaleString()}
          </Tag>
        ) : (
          "-"
        );
      },
      sorter: (a, b) => a.remaining - b.remaining,
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

export default UnderOverTable;

var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
