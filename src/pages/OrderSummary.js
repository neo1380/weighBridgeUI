import React from "react";
import "antd/dist/antd.css";
import { Typography, Alert, Button } from "antd";
import { Row, Col } from "antd";
const { Paragraph } = Typography;

export const OrderSummary = () => {
  return (
    <Row>
      <Col span={24}>
        {/*  <Typography.Title level={4} style={{ margin: 0 }}>
          Order Summary
        </Typography.Title> */}

        <Alert
          message="Transaction Completed Successfully !"
          type="success"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      </Col>
      <Col span={24}>
        <div className="ant-card ant-card-bordered">
          <div className="ant-card-head" style={{ backgroundColor: "#fafafa" }}>
            <div className="ant-card-head-wrapper">
              <div className="ant-card-head-title">Customer Information</div>
            </div>
          </div>
          <div className="ant-card-body">
            <Paragraph>Transaction Type : Incoming</Paragraph>
            <Paragraph>Customer Type : Vehicle</Paragraph>
            <Paragraph>Customer Name: Gowtham</Paragraph>
            <Paragraph>Customer ID : ABCD1234</Paragraph>
            <Paragraph>Phone Number: +966 1234567890</Paragraph>
            <Paragraph>Driver Count: 1 </Paragraph>
          </div>
        </div>
        <div className="ant-card ant-card-bordered mb-5">
          <div className="ant-card-head" style={{ backgroundColor: "#fafafa" }}>
            <div className="ant-card-head-wrapper">
              <div className="ant-card-head-title">Transaction:1</div>
            </div>
          </div>
          <div className="ant-card-body">
            <Paragraph>Material : Iron</Paragraph>
            <Paragraph>First Weight : 1000 Kgs</Paragraph>
            <Paragraph>Second Weight : 1000 Kgs</Paragraph>
            <Paragraph>Price : 500 SAD</Paragraph>
          </div>
        </div>
        <div className="ant-card ant-card-bordered mb-5">
          <div className="ant-card-head" style={{ backgroundColor: "#fafafa" }}>
            <div className="ant-card-head-wrapper">
              <div className="ant-card-head-title">Transaction:2</div>
            </div>
          </div>
          <div className="ant-card-body">
            <Paragraph>Material : Iron</Paragraph>
            <Paragraph>First Weight : 1000 Kgs</Paragraph>
            <Paragraph>Second Weight : 1000 Kgs</Paragraph>
            <Paragraph>Price : 500 SAD</Paragraph>
          </div>
        </div>

        <div className="ant-card ant-card-bordered mb-5">
          <div className="ant-card-head" style={{ backgroundColor: "#fafafa" }}>
            <div className="ant-card-head-wrapper">
              <div className="ant-card-head-title">Transaction:3</div>
            </div>
          </div>
          <div className="ant-card-body">
            <Paragraph>Material : Iron</Paragraph>
            <Paragraph>First Weight : 1000 Kgs</Paragraph>
            <Paragraph>Second Weight : 1000 Kgs</Paragraph>
            <Paragraph>Price : 500 SAD</Paragraph>
          </div>
        </div>
        <div className="ant-card ant-card-bordered mt-5">
          <div className="ant-card-head" style={{ backgroundColor: "#fafafa" }}>
            <div className="ant-card-head-wrapper">
              <div className="ant-card-head-title">Total price: 1500 SAD</div>
            </div>
          </div>
        </div>
        <p>
          <Button type="primary" htmlType="submit" className="mr-3 mt-5">
            Print Transaction
          </Button>
        </p>
      </Col>
    </Row>
  );
};

export default OrderSummary;
