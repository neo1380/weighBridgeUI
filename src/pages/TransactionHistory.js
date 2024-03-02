import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS, config } from "../constants/api.constants";
import { formatDateInTimeZone } from "../utils/dates.utils";

export const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactionData, settransactionData] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 0,
      pageSize: 10,
    },
  });
  const [loading, setLoading] = useState(false);

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
      render: (text) => <span>{formatDateInTimeZone(text)}</span>,
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
      render: (text) => (
        <span>{text ? formatDateInTimeZone(text) : "In progress"}</span>
      ),
    },
    {
      title: "Closed By",
      dataIndex: "closed_by",
      key: "closed_by",
      render: (text) => <span>{text || "NA"}</span>,
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
    setLoading(true);
    const materialList = config.url.BASE_URL + API_ENDPOINTS.GET_MATERIAL;
    fetch(materialList)
      .then((response) => response.json())
      .then((materials) => {
        setMaterials(materials);
      });
  }, []);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      const pageNo = tableParams.pagination.current;
      const ALL_TRANSACTIONS =
        API_ENDPOINTS.TRANSACTION_HISTORY_BY_PAGING.replace(
          "{pageNum}",
          pageNo
        );
      let materialsData = materials.length > 0 ? materials : [];
      if (!materials.length) {
        setLoading(false);
        return;
      }
      axios
        .get(config.url.BASE_URL + ALL_TRANSACTIONS)
        .then((tempTransactions) => {
          console.log(tempTransactions.data);
          const transactionList = tempTransactions.data;
          const filterData = [];
          transactionList.transactionDtoList.forEach((item) => {
            if (item.childTransactionDtoList) {
              item.childTransactionDtoList.forEach((child) => {
                item.priceType = child.baleOrLoose === "B" ? "Bale" : "Loose";
                item.materialName =
                  materialsData.find(
                    (mat) => mat.materialId === child.materialType
                  )?.materialName || "NA";
                filterData.push(item);
              });
            } else {
              filterData.push(item);
            }
          });
          setLoading(false);
          settransactionData(filterData);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: transactionList.totalTransaction,
              // 200 is mock data, you should read it from server
              // total: data.totalCount,
            },
          });
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materials, JSON.stringify(tableParams)]);

  const showSummary = ({ id }) => {
    navigate(`/summary/${id}?source=history`);
  };

  const Spinner = () => (
    <Spin className="spinner" tip="Loading transactions..." />
  );

  const handleChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

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
      onChange={handleChange}
      loading={loading}
      pagination={tableParams.pagination}
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
