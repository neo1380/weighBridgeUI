import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Spin, Table } from "antd";
import { Alert } from "antd";

import { API_ENDPOINTS, config } from "../constants/api.constants";
const { Title } = Typography;

export const OnGoingTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const Spinner = () => (
    <Spin className="spinner" tip="Loading Ongoing Transactions ...." />
  );
  const columns = [
    {
      title: "Vehicle Number",
      dataIndex: "vehicleNumber",
      key: "vehicleNumber",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Material",
      dataIndex: "materialName",
      key: "transactionId",
      render: (text) => <span>{text}</span>,
    },
  ];

  useEffect(() => {
    const getTemporaryTransactions = () => {
      setIsLoading(true);
      axios
        .get(config.url.BASE_URL + API_ENDPOINTS.TEMP_TRANSACTION)
        .then((response) => {
          setIsLoading(false);
          response.data.forEach((element) => {
            element.childTransactionDtoList.forEach((child) => {
              if (element.secondWeight === null || !element.secondWeight) {
                const material = materials.find(
                  (mat) => mat.materialId === child.materialType
                );
                element.materialName = material ? material.materialName : "NA";
              } else {
                element.materialName = "NA";
              }
            });
          });
          setTransactions(response.data || []);
        });
    };

    getTemporaryTransactions();

    return () => {
      setTransactions([]);
    };
  }, [materials]);

  useEffect(() => {
    const getMaterials = () => {
      const materialList = config.url.BASE_URL + API_ENDPOINTS.GET_MATERIAL;
      fetch(materialList)
        .then((response) => response.json())
        .then((materials) => {
          setMaterials(materials, () => {
            setIsLoading(false);
          });
        });
    };
    getMaterials();
    return () => {
      setMaterials([]);
    };
  }, []);

  const OnGoingTransactionList = () => (
    <>
      <Title
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
        level={5}
      >
        Ongoing Transactions
      </Title>
      <Table size="small" columns={columns} dataSource={transactions} />
    </>
  );

  const TransactionList = () => {
    return transactions.length > 0 ? (
      <OnGoingTransactionList />
    ) : (
      <Alert message="No Active transactions" type="info" showIcon />
    );
  };

  return <>{isLoading ? <Spinner /> : <TransactionList />}</>;
};

export default OnGoingTransactions;
