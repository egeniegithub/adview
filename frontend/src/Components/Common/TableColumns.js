import { Button, Input, Space, Tag, Tooltip } from "antd";
import { WarningOutlined, FilterFilled, CheckCircleTwoTone, CloseCircleOutlined } from "@ant-design/icons";

export const adviewTableColumns = [
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
    title: "Account Balance",
    dataIndex: "accountBalance",
    key: "accountBalance",
    sorter: (a, b) => a.accountBalance - b.accountBalance,
    render: (text) =>
      text > 0 ? (
        "$" + parseInt(text).toLocaleString()
      ) : (
        <p style={{ color: `red` }}>
          {parseInt(text) < 0 ? '-' : ''}${Math.abs(parseInt(text)).toLocaleString()}
        </p>
      ),
      filters: [
        {
          text: "Over",
          value: "over",
        },
        {
          text: "Under",
          value: "under",
        }
      ],
      onFilter: (value, record) => {
        if (value === "over") {
          return record.accountBalance <= 0;
        } else if (value === "under") {
          return record.accountBalance > 0;
        }
        return false; // Handle unexpected filter values
      },
  },
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
    title: "Monthly Budget",
    dataIndex: "monthly_budget",
    key: "MonthlyBudget",
    render: (text) => (text > 0 ? "$" + parseInt(text).toLocaleString() : "-"),
    sorter: (a, b) => a.monthly_budget - b.monthly_budget,
  },
  {
    title: "Month-to-Date Spent",
    dataIndex: "monthly_spent",
    key: "Month_to_DateSpent",
    render: (text) => (text > 0 ? "$" + parseInt(text).toLocaleString() : "-"),
    sorter: (a, b) => a.monthly_spent - b.monthly_spent,
  },
  // {
  //   title: (
  //     <Tooltip title="This column represents how much budget is remaining this month and is calculated by the total Monthly Budget minus Month-to-Date Spent.">
  //       Remaining
  //     </Tooltip>
  //   ),
  //   dataIndex: "remaining",
  //   key: "Remaining",
  //   sorter: (a, b) => a.remaining - b.remaining,
  //   render: (text) => (
  //     <Tooltip title={`This column represents how much budget is remaining this month and is calculated by the total Monthly Budget minus Month-to-Date Spent.`}>
  //       {text > 0 ? "$" + parseInt(text).toLocaleString() : "-"}
  //     </Tooltip>
  //   ),
  // },
  {
    title: (
      <Tooltip title="This column represents how much budget is remaining this month and is calculated by the total Monthly Budget minus Month-to-Date Spent.">
        <div style={{ width: '100%', height: '100%' }}>Remaining</div>
      </Tooltip>
    ),
    dataIndex: "remaining",
    key: "Remaining",
    sorter: (a, b) => a.remaining - b.remaining,
    render: (text) => (
      <Tooltip title={`This column represents how much budget is remaining this month and is calculated by the total Monthly Budget minus Month-to-Date Spent.`}>
        <div style={{ width: '100%' }}>{text > 0 ? "$" + parseInt(text).toLocaleString() : "-"}</div>
      </Tooltip>
    ),
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

export const AccountsTableColumns = (setEmail, showModal) => {
  return [
    {
      title: "Client",
      dataIndex: "client",
      key: "Client",
      width: "40%",
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
      sorter: (a, b) => a.is_active_from_bubble - b.is_active_from_bubble,
    filters: [
      {
        text: "Active",
        value: "1",
      },
      {
        text: "Inactive",
        value: "0",
      }
    ],
    onFilter: (value, record) => record.is_active_from_bubble.indexOf(value) === 0,
    },
    {
      title: "Account Balance",
      dataIndex: "accountBalance",
      key: "accountBalance",
      sorter: (a, b) => a.accountBalance - b.accountBalance,
      render: (text) =>
        text > 0 ? (
          "$" + parseInt(text).toLocaleString()
        ) : (
          <p style={{ color: `red` }}>
            {parseInt(text) < 0 ? '-' : ''}${Math.abs(parseInt(text)).toLocaleString()}
          </p>
        ),
        filters: [
          {
            text: "Over",
            value: "over",
          },
          {
            text: "Under",
            value: "under",
          }
        ],
        onFilter: (value, record) => {
          if (value === "over") {
            return record.accountBalance <= 0;
          } else if (value === "under") {
            return record.accountBalance > 0;
          }
          return false; // Handle unexpected filter values
        },
    },
    {
      title: "Google",
      dataIndex: "google",
      key: "Google",
      align: "center",
      render: (val, obj) => {
        let is_linked = obj.is_google_login
        if (is_linked === "0") {
          return <><CloseCircleOutlined style={{ color: 'red' }} /></>
        } else {
          return <><CheckCircleTwoTone twoToneColor="#52c41a" /></>
        }
      },
    },
    {
      title: "Bing",
      dataIndex: "bing",
      key: "Bing",
      align: "center",
      render: (val, obj) => {
        let is_linked = obj.is_bing_login
        if (is_linked === "0") {
          return <><CloseCircleOutlined style={{ color: 'red' }} /></>
        } else {
          return <><CheckCircleTwoTone twoToneColor="#52c41a" /></>
        }
      },
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedin",
      key: "LinkedIn",
      align: "center",
      render: (val, obj) => {
        let is_linked = obj.is_linkedin_login
        if (is_linked === "0") {
          return <><CloseCircleOutlined style={{ color: 'red' }} /></>
        } else {
          return <><CheckCircleTwoTone twoToneColor="#52c41a" /></>
        }
      },
    },
    {
      title: "Meta",
      dataIndex: "facebook",
      key: "Facebook",
      align: "center",
      render: (val, obj) => {
        let is_linked = obj.is_meta_login
        if (is_linked === "0") {
          return <><CloseCircleOutlined style={{ color: 'red' }} /></>
        } else {
          return <><CheckCircleTwoTone twoToneColor="#52c41a" /></>
        }
      },
    },
  ];
};
