import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import { Typography, Button, Row, Col, Spin } from "antd";
import dayjs from "dayjs";

/* import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
 */
import { API_ENDPOINTS, config } from "../constants/api.constants";
import { useParams } from "react-router";

const { Paragraph } = Typography;

export const OrderSummary = () => {
  const { id } = useParams();
  /*   const navigate = useNavigate(); */
  const [transaction, setTransaction] = useState(null);
  const [materials, setMaterials] = useState([]);
  const customerTypeMap = {
    3: "Vehicle",
    1: "Layman",
  };
  const transferTypeMap = {
    INC: "Incoming",
    OUT: "Outgoing",
    WEIGH: "Weight Only",
  };
  useEffect(() => {
    const transactionURL =
      config.url.BASE_URL + API_ENDPOINTS.GET_TRANSACTION_BY_ID + `${id}`;
    fetch(transactionURL)
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data);
      });
  }, [id]);

  useEffect(() => {
    const materialList = config.url.BASE_URL + API_ENDPOINTS.GET_MATERIAL;
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

  const getMaterialNetWeight = ({
    firstWeight,
    secondWeight,
    absoluteWeight,
  }) => {
    const { transferType } = transaction;
    if (transferType === "OUT") {
      return absoluteWeight;
    } else {
      return absoluteWeight;
    }
  };

  const getTransferType = ({ transferType }) => {
    return transferTypeMap[transferType];
  };

  const getCustomerType = ({ customerType }) => {
    return customerTypeMap[customerType];
  };

  const getClosedDate = ({ closed_date }) => {
    const date = dayjs(closed_date);
    const formattedDate = date.format("DD-MM-YYYY HH:mm A");
    return formattedDate;
  };

  const getTransactionPrice = (data, roundoff = false) => {
    let price = null;
    const {
      includeVat,
      materialPricewithVat,
      materialPricewithoutVat,
      materialPricewithVatRoundOff,
      materialPricewithoutVatRoundOff,
    } = data;

    if (roundoff) {
      price = includeVat
        ? materialPricewithVatRoundOff
        : materialPricewithoutVatRoundOff;
    } else {
      price = includeVat ? materialPricewithVat : materialPricewithoutVat;
    }

    const parsedPrice = price + " SAR";
    return parsedPrice;
  };

  /*  const goToWeightMgmt = () => {
    navigate(`/weighm`);
  };
 */
  const printTransaction = (event) => {
    window.print();
  };

  return (
    <Row>
      {transaction ? (
        <>
          {/*   <Col span={24}>
            <Typography.Title
              level={4}
              style={{ margin: 0, marginBottom: "20px" }}
            >
              <LeftOutlined />{" "}
              <Button
                type="link"
                size={"small"}
                onClick={() => goToWeightMgmt()}
              >
                Back to Weight Management
              </Button>
            </Typography.Title>
          </Col> */}
          <Col span={24}>
            <Typography.Title
              level={4}
              style={{ margin: 0, marginBottom: "20px" }}
            >
              Order Summary | Transaction ID: {id}
            </Typography.Title>
          </Col>
          <Col span={24}>
            <div className="ant-card ant-card-bordered">
              <div
                className="ant-card-head"
                style={{ backgroundColor: "#fafafa" }}
              >
                <div className="ant-card-head-wrapper">
                  <div className="ant-card-head-title">Order Information</div>
                </div>
              </div>
              <div className="ant-card-body">
                <Paragraph>
                  Transaction Closed Date : {getClosedDate(transaction)}
                </Paragraph>
              </div>
            </div>
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
                {transaction.transferType !== "WEIGH" ? (
                  <>
                    <Paragraph>
                      Customer Type : {getCustomerType(transaction)}
                    </Paragraph>
                    <Paragraph>
                      Customer Name: {transaction.customerName}
                    </Paragraph>
                    <Paragraph>
                      Customer ID : {transaction.customerId}
                    </Paragraph>
                    <Paragraph>
                      Phone Number: {transaction.phoneNumber}
                    </Paragraph>
                    {transaction.driverCount ? (
                      <Paragraph>
                        Driver Count: {transaction.driverCount}
                      </Paragraph>
                    ) : null}
                  </>
                ) : null}

                {transaction.vehicleNumber ? (
                  <Paragraph>
                    Vehicle Number: {transaction.vehicleNumber}
                  </Paragraph>
                ) : null}
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
                        Material Net Weight : {getMaterialNetWeight(child)}
                        {" kgs"}
                      </Paragraph>
                      <Paragraph>
                        First Weight : {child.firstWeight} Kgs
                      </Paragraph>
                      <Paragraph>
                        Second Weight : {child.secondWeight} Kgs
                      </Paragraph>
                      {/*     <Paragraph>
                        Price Per Tonne: {getMaterialPricePerTonne(child)}
                      </Paragraph> */}
                      {
                        <Paragraph>
                          Round off price : {getTransactionPrice(child)}
                        </Paragraph>
                      }
                      <Paragraph>
                        Actual Price : {getTransactionPrice(child, true)}
                      </Paragraph>
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
                      <p>
                        Total price without round off: {transaction.finalAmount}{" "}
                        SAR
                      </p>
                      <p>
                        {" "}
                        Total price: {transaction.finalAmountRoundOff} SAR{" "}
                      </p>
                    </div>
                    <div className="ant-card-head-title"></div>
                  </div>
                </div>
              </div>
            ) : null}

            <p>
              <Button
                type="primary"
                htmlType="submit"
                onClick={printTransaction}
                className="mr-3 mt-5 hide-print"
              >
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
