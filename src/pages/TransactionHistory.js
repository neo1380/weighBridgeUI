import React, { useState, useEffect, useCallback } from "react";
import { Table } from "antd";
import axios from "axios";
import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";

export const TransactionHistory = () => {
  //   const columns = [
  //     {
  //       title: "Name",
  //       dataIndex: "name",
  //       key: "name",
  //       render: (text) => <span>{text}</span>,
  //     },
  //     {
  //       title: "Age",
  //       dataIndex: "age",
  //       key: "age",
  //     },
  //     {
  //       title: "Address",
  //       dataIndex: "address",
  //       key: "address",
  //     },
  //     {
  //       title: "Tags",
  //       key: "tags",
  //       dataIndex: "tags",
  //       render: (tags) => (
  //         <>
  //           {tags.map((tag) => {
  //             let color = tag.length > 5 ? "geekblue" : "green";
  //             if (tag === "loser") {
  //               color = "volcano";
  //             }
  //             return (
  //               <Tag color={color} key={tag}>
  //                 {tag.toUpperCase()}
  //               </Tag>
  //             );
  //           })}
  //         </>
  //       ),
  //     },
  //     {
  //       title: "Action",
  //       key: "action",
  //       render: (text, record) => (
  //         <Space size="middle">
  //           <a>Invite {record.name}</a>
  //           <a>Delete</a>
  //         </Space>
  //       ),
  //     },
  //   ];

  const [transactionData, settransactionData] = useState([]);
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Customer ID",
      dataIndex: "customerID",
      key: "customerID",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Customer Type",
      dataIndex: "customerType",
      key: "customerType",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Vehicle No",
      dataIndex: "vehicleNo",
      key: "vehicleNo",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Closed At",
      dataIndex: "closedAt",
      key: "closedAt",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Closed By",
      dataIndex: "closedBy",
      key: "closedBy",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Material",
      dataIndex: "material",
      key: "material",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Price Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Remarks",
      dataIndex: "comments",
      key: "comments",
      render: (text) => <span>{text}</span>,
    },
  ];

  //   const data = [
  //     {
  //       key: "1",
  //       name: "John Brown",
  //       age: 32,
  //       address: "New York No. 1 Lake Park",
  //       tags: ["nice", "developer"],
  //     },
  //     {
  //       key: "2",
  //       name: "Jim Green",
  //       age: 42,
  //       address: "London No. 1 Lake Park",
  //       tags: ["loser"],
  //     },
  //     {
  //       key: "3",
  //       name: "Joe Black",
  //       age: 32,
  //       address: "Sidney No. 1 Lake Park",
  //       tags: ["cool", "teacher"],
  //     },
  //   ];

  const getTransactions = () => {
    axios
      .get(BASE_URL + API_ENDPOINTS.CURRENT_DAY_TRANSACTION)
      .then((tempTransactions) => {
        console.log(tempTransactions.data);
        settransactionData(tempTransactions.data || []);
      });
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const data = [
    {
      transactionId: 11,
      customerName: "Mohan",
      customerID: "AXQPD1100M",
      customerType: "MERCHANT",
      vehicleNo: "TN18R7498",
      createdAt: "2022-03-05T15:25",
      createdBy: "Karthik",
      closedAt: "2022-03-05T15:35",
      closedBy: "Karthik",
      status: "FULFILLED",
      material: "Paper",
      totalPrice: "$120",
      comments: "Vehicle entered with 2 drivers",
    },
    {
      transactionId: 12,
      customerName: "Dinesh",
      customerID: "AXQPD1100M",
      customerType: "MERCHANT",
      vehicleNo: "TN18R7498",
      createdAt: "2022-03-05T15:25",
      createdBy: "Subash",
      closedAt: "2022-03-05T15:35",
      closedBy: "Subash",
      status: "CANCELLED",
      material: "Paper",
      totalPrice: "$120",
      comments: "Cancelled due to improper documents",
    },
    {
      transactionId: 13,
      customerName: "Subash",
      customerID: "AXQPD1100M",
      customerType: "MERCHANT",
      vehicleNo: "TN18R7498",
      createdAt: "2022-03-05T15:25",
      createdBy: "Subash",
      closedAt: "2022-03-05T15:35",
      closedBy: "Subash",
      status: "IN-QUEUE",
      material: "Paper",
      totalPrice: "$120",
      comments: "NA",
    },
  ];

  return <Table size="small" columns={columns} dataSource={data} />;
};

export default TransactionHistory;
