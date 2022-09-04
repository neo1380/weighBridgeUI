import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import { Typography, Button } from "antd";
import { Row, Col } from "antd";
import { Spin } from "antd";

import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";
import { useParams } from "react-router";

const { Paragraph } = Typography;

export const OrderSummary = () => {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [materials, setMaterials] = useState([]);
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
    const transactionURL =
      BASE_URL + API_ENDPOINTS.GET_TRANSACTION_BY_ID + `${id}`;
    fetch(transactionURL)
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data);
      });
  }, [id]);

  useEffect(() => {
    const materialList = BASE_URL + API_ENDPOINTS.GET_MATERIAL;
    fetch(materialList)
      .then((response) => response.json())
      .then((materials) => {
        if (materials && materials.length) {
          materials.sort((a, b) => a.materialId - b.materialId);
          materials.map((material, index) => (material.key = index.toString()));
          setMaterials(materials);
        }
      });
    return () => setMaterials([]);
  }, []);

  const getMaterialDesc = ({ materialType }) => {
    const isMaterial = materials.find((mat) => mat.materialId === materialType);
    return isMaterial ? isMaterial.materialName : "Material Not found";
  };

  const getMaterialNetWeight = ({ firstWeight, secondWeight }) => {
    const { transferType } = transaction;
    if (transferType === "OUT") {
      return secondWeight - firstWeight;
    } else {
      return firstWeight - secondWeight;
    }
  };

  const getTransferType = ({ transferType }) => {
    return transferTypeMap[transferType];
  };

  const getCustomerType = ({ customerType }) => {
    return customerTypeMap[customerType];
  };
  return (
    <Row>
      {transaction ? (
        <>
          <Col span={24}>
            <Typography.Title
              level={4}
              style={{ margin: 0, marginBottom: "20px" }}
            >
              Order Summary
            </Typography.Title>
          </Col>
          <Col span={24}>
            <div className="ant-card ant-card-bordered">
              <div
                className="ant-card-head"
                style={{ backgroundColor: "#fafafa" }}
              >
                <div className="ant-card-head-wrapper">
                  <div className="ant-card-head-title">
                    Customer Information
                  </div>
                </div>
              </div>
              <div className="ant-card-body">
                <Paragraph>
                  Transaction Type : {getTransferType(transaction)}
                </Paragraph>
                <Paragraph>
                  Customer Type : {getCustomerType(transaction)}
                </Paragraph>
                <Paragraph>Customer Name: {transaction.customerName}</Paragraph>
                <Paragraph>Customer ID : {transaction.customerId}</Paragraph>
                <Paragraph>Phone Number: {transaction.phoneNumber}</Paragraph>
                <Paragraph>Driver Count: {transaction.driverCount}</Paragraph>
              </div>
            </div>
            {transaction.childTransactionDtoList.map((child, index) => {
              return (
                <div>
                  <div className="ant-card ant-card-bordered mb-5">
                    <div
                      className="ant-card-head"
                      style={{ backgroundColor: "#fafafa" }}
                    >
                      <div className="ant-card-head-wrapper">
                        <div className="ant-card-head-title">
                          Transaction:{index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="ant-card-body">
                      <Paragraph>Material : {getMaterialDesc(child)}</Paragraph>
                      <Paragraph>
                        Material Net Weight : {getMaterialNetWeight(child)}{" "}
                        {"kgs"}
                      </Paragraph>
                      {/*  <Paragraph>
                        First Weight : {transaction.firstWeight} Kgs
                      </Paragraph>
                      <Paragraph>
                        Second Weight : {transaction.secondWeight} Kgs
                      </Paragraph>
                      <Paragraph>
                        Price : {transaction.materialPricewithVat}
                      </Paragraph> */}
                    </div>
                  </div>
                </div>
              );
            })}

            {transaction?.transferType !== "OUT" ? (
              <div className="ant-card ant-card-bordered mt-5">
                <div
                  className="ant-card-head"
                  style={{ backgroundColor: "#fafafa" }}
                >
                  <div className="ant-card-head-wrapper">
                    <div className="ant-card-head-title">
                      Total price: {transaction.finalAmount} SAR
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <p>
              <Button type="primary" htmlType="submit" className="mr-3 mt-5">
                Print Transaction
              </Button>
            </p>
          </Col>
        </>
      ) : (
        <Spin className="spinner" tip="Loading..."></Spin>
      )}
    </Row>
  );
};

export default OrderSummary;
