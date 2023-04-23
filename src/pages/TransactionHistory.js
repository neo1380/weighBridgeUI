import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";

export const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactionData, settransactionData] = useState([]);
  //   const [materials, setMaterials] = useState([]);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Customer Type",
      dataIndex: "customerType",
      key: "customerType",
      render: (text) => <span>{customerTypeMap[text] || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Transaction Type",
      dataIndex: "transferType",
      key: "transferType",
      render: (text) => <span>{transferTypeMap[text] || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Vehicle No",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Created At",
      dataIndex: "created_date",
      key: "created_date",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Closed At",
      dataIndex: "closed_date",
      key: "closed_date",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Closed By",
      dataIndex: "closed_by",
      key: "closed_by",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Material",
      dataIndex: "materialName",
      key: "materialName",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Total Weight",
      dataIndex: "totalWeight",
      key: "totalWeight",
      render: (text) => <span>{text ? text : "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Material Collection",
      dataIndex: "priceType",
      key: "priceType",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },
    {
      title: "Total Price",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },

    {
      title: "Remarks",
      dataIndex: "comments",
      key: "comments",
      render: (text) => <span>{text || "NA"}</span>,
      responsive: ["md"],
    },
  ];
  const customerTypeMap = {
    3: "Vehicle",
    1: "Layman",
  };
  const transferTypeMap = {
    INC: "Incoming",
    OUT: "Outgoing",
    WT: "Weight Only",
  };

  useEffect(() => {
    const materialList = BASE_URL + API_ENDPOINTS.GET_MATERIAL;
    fetch(materialList)
      .then((response) => response.json())
      .then((materials) => {
        const ALL_TRANSACTIONS = API_ENDPOINTS.GET_ALL_TRANSACTIONS.replace(
          "{sortParam}",
          "transactionId"
        ).replace("{order}", 2);
        axios.get(BASE_URL + ALL_TRANSACTIONS).then((tempTransactions) => {
          console.log(tempTransactions.data);
          const filterData = [];
          tempTransactions.data.forEach((item) => {
            if (item.childTransactionDtoList) {
              item.childTransactionDtoList.forEach((child) => {
                item.priceType = child.baleOrLoose === "B" ? "Bale" : "Loose";
                item.materialName = materials.find(
                  (mat) => mat.materialId === child.materialType
                ).materialName;
                filterData.push(item);
              });
            }
          });
          settransactionData(filterData);
        });
      });
    return () => settransactionData([]);
  }, []);

  const showSummary = ({ id }) => {
    navigate(`/summary/${id}`);
  };

  const Spinner = () => (
    <Spin className="spinner" tip="Loading transactions..." />
  );
  const TransactionTable = () => (
    <Table
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            console.log(record);
            showSummary(record);
          },
        };
      }}
      size="small"
      columns={columns}
      dataSource={transactionData}
    />
  );
  return (
    <>
      {transactionData && transactionData.length ? (
        <TransactionTable />
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default TransactionHistory;
