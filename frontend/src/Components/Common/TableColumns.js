import { Tag } from "antd";
import { WarningOutlined } from "@ant-design/icons";
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
  {
    title: "Remaining",
    dataIndex: "remaining",
    key: "Remaining",
    render: (text) => (text > 0 ? "$" + parseInt(text).toLocaleString() : "-"),
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

export const AccountsTableColumns = (setEmail, showModal) => {
  return [
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
};
