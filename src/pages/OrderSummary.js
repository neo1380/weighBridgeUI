import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import {
  Typography,
  Button,
  Row,
  Col,
  Spin,
  Modal,
  Form,
  Checkbox,
} from "antd";
import { formatDateInTimeZone } from "../utils/dates.utils";

/* import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
 */
import { API_ENDPOINTS, config } from "../constants/api.constants";
import { useParams } from "react-router";

const { Paragraph } = Typography;

export const OrderSummary = () => {
  const { id } = useParams();
  const [printOptionsForm] = Form.useForm();

  /*   const navigate = useNavigate(); */
  const [transaction, setTransaction] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [showIncomingPrintOptionsModal, setShowIncomingPrintOptionsModal] =
    useState(false);
  const [hidePriceInPrint, setHidePriceInPrint] = useState(false);
  const customerTypeMap = {
    3: "Vehicle",
    1: "Layman",
  };
  const transferTypeMap = {
    INC: "Incoming",
    OUT: "Outgoing",
    WEIGH: "WEIGH",
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

  /*  const getMaterialNetWeight = ({
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
  }; */

  const getTransferType = ({ transferType }) => {
    return transferTypeMap[transferType];
  };

  const getCustomerType = ({ customerType }) => {
    return customerTypeMap[customerType];
  };

  const getClosedDate = ({ closed_date }) => {
    return formatDateInTimeZone(closed_date);
  };

  const showPricePerTonne = (data) => {
    return (
      data.materialPricePerTonne && getTransferType(transaction) !== "WEIGH"
    );
  };
  const getTransactionPrice = (data, roundoff = false) => {
    let price = null;
    const {
      includeVat,
      transactionPricewithVat,
      transactionPricewithoutVat,
      transactionPricewithVatRoundOff,
      transactionPricewithoutVatRoundOff,
    } = data;

    if (roundoff) {
      price = includeVat
        ? transactionPricewithVatRoundOff
        : transactionPricewithoutVatRoundOff;
    } else {
      price = includeVat ? transactionPricewithVat : transactionPricewithoutVat;
    }

    const parsedPrice = price + " SAR";
    return price ? parsedPrice : "NA";
  };

  /*  const goToWeightMgmt = () => {
    navigate(`/weighm`);
  };
 */
  const printTransaction = () => {
    window.print();
  };

  const triggerPrint = (transaction) => {
    if (transaction.transferType === "INC") {
      setShowIncomingPrintOptionsModal(true);
      return;
    }
    printTransaction();
  };

  const PrintOptionsModal = () => {
    const printFormInitialValues = {
      togglePrice: true,
    };
    const cancelModal = () => {
      setShowIncomingPrintOptionsModal(false);
    };
    const onPrintOptionsSubmit = () => {
      const showPrice = printOptionsForm.getFieldValue("togglePrice");
      setHidePriceInPrint(!showPrice);
      cancelModal();
      setTimeout(() => {
        printTransaction();
      }, 1000);
    };
    return (
      <Modal
        title="Incoming Print Options"
        visible={showIncomingPrintOptionsModal}
        onOk={onPrintOptionsSubmit}
        onCancel={cancelModal}
        afterClose={printTransaction}
      >
        <Form
          form={printOptionsForm}
          layout="vertical"
          name="updatePrintOptionsModal"
          initialValues={printFormInitialValues}
        >
          <Form.Item name="togglePrice" valuePropName="checked">
            <Checkbox>Display price in order summary</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    );
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
          <Col span={12}>
            <h4 style={{ margin: 0, marginBottom: "15px", fontSize: "18px" }}>
              {" "}
              Order Summary | Transaction ID: {id}
            </h4>
          </Col>
          <Col
            span={12}
            style={{ margin: 0, marginBottom: "15px", fontSize: "18px" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => triggerPrint(transaction)}
              className="mr-3 hide-print ml-10"
            >
              Print Transaction
            </Button>
          </Col>
          <Col span={24}>
            <div className="ant-card ant-card-bordered">
              <div
                className="ant-card-head"
                style={{ backgroundColor: "#fafafa", minHeight: "35px" }}
              >
                <div className="ant-card-head-wrapper">
                  <div className="ant-card-head-title pb-1 pt-1">
                    Order Information
                  </div>
                </div>
              </div>
              <div
                className="ant-card-body"
                style={{ padding: "10px 10px 0px 24px" }}
              >
                <Paragraph>
                  Transaction Closed Date : {getClosedDate(transaction)}
                </Paragraph>
              </div>
            </div>
            <div className="ant-card ant-card-bordered">
              <div
                className="ant-card-head"
                style={{ backgroundColor: "#fafafa", minHeight: "35px" }}
              >
                <div className="ant-card-head-wrapper">
                  <div className="ant-card-head-title pb-1 pt-1">
                    Customer Information
                  </div>
                </div>
              </div>
              <div
                className="ant-card-body"
                style={{ padding: "10px 10px 0px 24px" }}
              >
                {transaction.transferType === "WEIGH" ? (
                  <Paragraph>
                    Transaction Type : {getTransferType(transaction)}
                  </Paragraph>
                ) : null}

                {transaction.transferType !== "WEIGH" ? (
                  <>
                    <Row>
                      <Col span={12}>
                        <Paragraph>
                          Transaction Type : {getTransferType(transaction)}
                        </Paragraph>
                        <Paragraph>
                          Customer Type : {getCustomerType(transaction)}
                        </Paragraph>
                        <Paragraph>
                          Customer Name: {transaction.customerName}
                        </Paragraph>
                        <Paragraph>
                          Customer ID : {transaction.customerId}
                        </Paragraph>
                      </Col>
                      <Col span={12}>
                        <Paragraph>
                          Phone Number: {transaction.phoneNumber}
                        </Paragraph>
                        {transaction.vehicleNumber ? (
                          <Paragraph>
                            Vehicle Number: {transaction.vehicleNumber}
                          </Paragraph>
                        ) : null}
                        {transaction.driverCount ? (
                          <Paragraph>
                            Driver Count: {transaction.driverCount}
                          </Paragraph>
                        ) : null}
                      </Col>
                    </Row>
                  </>
                ) : null}
              </div>
            </div>
            {transaction.childTransactionDtoList.map((child, index) => {
              return (
                <div>
                  <div className="ant-card ant-card-bordered mb-5">
                    <div
                      className="ant-card-head"
                      style={{ backgroundColor: "#fafafa", minHeight: "35px" }}
                    >
                      <div className="ant-card-head-wrapper">
                        <div className="ant-card-head-title pt-1 pb-1">
                          Transaction:{index + 1}
                        </div>
                      </div>
                    </div>
                    <div
                      className="ant-card-body"
                      style={{ padding: "10px 10px 0px 24px" }}
                    >
                      <Row>
                        <Col span={12}>
                          <Paragraph>
                            Material : {getMaterialDesc(child)}
                          </Paragraph>
                          {/*     <Paragraph>
                            Material Net Weight : {getMaterialNetWeight(child)}
                            {" kgs"}
                          </Paragraph> */}
                          <Paragraph>
                            First Weight : {child.firstWeight} Kgs
                          </Paragraph>
                          <Paragraph>
                            Second Weight : {child.secondWeight} Kgs
                          </Paragraph>
                          {showPricePerTonne(child) ? (
                            <Paragraph>
                              Price per Tonne : {child.materialPricePerTonne}{" "}
                              SAR
                            </Paragraph>
                          ) : null}
                        </Col>
                        <Col span={12}>
                          <div className={hidePriceInPrint ? "hide-print" : ""}>
                            {
                              <Paragraph>
                                Vat Applied : {child.includeVat ? "Yes" : "NA"}
                              </Paragraph>
                            }
                            {
                              <Paragraph>
                                Round off price : {getTransactionPrice(child)}
                              </Paragraph>
                            }
                            <Paragraph>
                              Actual Price : {getTransactionPrice(child, true)}
                            </Paragraph>
                          </div>
                        </Col>
                      </Row>

                      {/*     <Paragraph>
                        Price Per Tonne: {getMaterialPricePerTonne(child)}
                      </Paragraph> */}
                    </div>
                  </div>
                </div>
              );
            })}

            {transaction?.transferType !== "OUT" ? (
              <div className={hidePriceInPrint ? "hide-print" : ""}>
                <div className="ant-card ant-card-bordered mt-5">
                  <div
                    className="ant-card-head"
                    style={{ backgroundColor: "#fafafa" }}
                  >
                    <div className="ant-card-head-wrapper">
                      <div className="ant-card-head-title pb-1 pt-1">
                        <p>
                          Total price without round off:{" "}
                          {transaction.finalAmount} SAR
                        </p>
                        <p>
                          {" "}
                          Total price: {
                            transaction.finalAmountRoundOff
                          } SAR{" "}
                        </p>
                      </div>
                      <div className="ant-card-head-title"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/*   <p>
              <Button
                type="primary"
                htmlType="submit"
                onClick={printTransaction}
                className="mr-3 mt-5 hide-print"
              >
                Print Transaction
              </Button>
            </p> */}
            <PrintOptionsModal />
          </Col>
        </>
      ) : (
        <Spin className="spinner" tip="Loading..."></Spin>
      )}
    </Row>
  );
};

export default OrderSummary;
