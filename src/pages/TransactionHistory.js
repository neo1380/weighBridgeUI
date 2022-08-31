import React, { useState, useEffect } from "react";
import { Table } from "antd";
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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Customer Type",
      dataIndex: "customerType",
      key: "customerType",
      render: (text) => <span>{customerTypeMap[text]}</span>,
    },
    {
      title: "Transaction Type",
      dataIndex: "transferType",
      key: "transferType",
      render: (text) => <span>{transferTypeMap[text]}</span>,
    },
    {
      title: "Vehicle No",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
      render: (text) => <span>{text}</span>,
    },
    /* {
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
    }, */
    {
      title: "Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Material",
      dataIndex: "materialName",
      key: "materialName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Total Weight",
      dataIndex: "totalWeight",
      key: "totalWeight",
      render: (text) => <span>{text ? text : "NA"}</span>,
    },
    {
      title: "Price Type",
      dataIndex: "priceType",
      key: "priceType",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Total Price",
      dataIndex: "finalAmount",
      key: "finalAmount",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Remarks",
      dataIndex: "comments",
      key: "comments",
      render: (text) => <span>{text}</span>,
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
        axios
          .get(BASE_URL + API_ENDPOINTS.CURRENT_DAY_TRANSACTION)
          .then((tempTransactions) => {
            console.log(tempTransactions.data);
            const filterData = [];
            tempTransactions.data.forEach((item) => {
              item.childTransactionDtoList.forEach((child) => {
                item.priceType = child.priceType === "B" ? "Bale" : "Loose";
                item.materialName = materials.find(
                  (mat) => mat.materialId === child.materialType
                ).materialName;
                filterData.push(item);
              });
            });
            settransactionData(filterData);
          });
      });
    return () => settransactionData([]);
  }, []);

  const showSummary = ({ id }) => {
    navigate(`/summary/${id}`);
  };
  return (
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
};

export default TransactionHistory;
