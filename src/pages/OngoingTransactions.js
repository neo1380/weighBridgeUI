import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Typography, Space, Spin } from "antd";

import { Row, Col } from "antd";
import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";
const { Title } = Typography;

export const OnGoingTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  //   const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const Spinner = () => (
    <Spin className="spinner" tip="Loading Ongoing Transactions ...." />
  );

  useCallback(() => {}, []);

  useEffect(() => {
    const getTemporaryTransactions = () => {
      setIsLoading(true);
      axios.get(BASE_URL + API_ENDPOINTS.TEMP_TRANSACTION).then((response) => {
        setIsLoading(false);
        setTransactions(response.data || []);
        // console.log(materials);
      });
    };

    const getMaterials = () => {
      const materialList = BASE_URL + API_ENDPOINTS.GET_MATERIAL;
      fetch(materialList)
        .then((response) => response.json())
        .then((materials) => {
          //   setMaterials(materials);
          setIsLoading(false);
          getTemporaryTransactions();
        });
    };
    getMaterials();

    return () => {
      setTransactions([]);
      //   setMaterials([]);
    };
  }, []);

  const TransactionList = () => {
    return transactions.length > 0 ? (
      <Row gutter={24}>
        <Col span={24}>
          <Space direction="vertical">
            <Title type="primary" level={5} className="mt-2">
              Ongoing transactions
            </Title>

            {transactions.map((transaction) => {
              return (
                <Button type="link" key={transaction.id} className="pl-0">
                  {transaction?.vehicleNumber
                    ? transaction.vehicleNumber
                    : transaction.customerName}
                </Button>
              );
            })}
          </Space>
        </Col>
      </Row>
    ) : (
      <p>"No Active Transactions"</p>
    );
  };

  return <>{isLoading ? <Spinner /> : <TransactionList />}</>;
};

export default OnGoingTransactions;
