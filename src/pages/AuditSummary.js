import React from "react";
import "antd/dist/antd.min.css";
import { Row, Col } from "antd";
import { DatePicker, Button, Select } from "antd";

export const AuditSummary = () => {
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const triggerReportSummary = () => console.log("triggerReportSummary");
  const handleChange = () => console.log("handleChange");

  return (
    <Row>
      <Col span={24}>
        <div className="ant-card ant-card-bordered">
          <div
            className="ant-card-head"
            style={{ backgroundColor: "#fafafa", minHeight: "35px" }}
          >
            <div className="ant-card-head-wrapper">
              <div className="ant-card-head-title pb-1 pt-1">
                Download Report Summary
              </div>
            </div>
          </div>
          <div
            className="ant-card-body"
            style={{ padding: "10px 10px 0px 24px" }}
          >
            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}> Download Report by Date:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChange} />
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}> Download Weekly Report:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChange} picker="week" />
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}>Download Monthly Report:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChange} picker="month" />
                </Col>
              </Row>
            </Col>

            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}> Download Quarterly Report:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChange} picker="quarter" />
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}>Download Yearly Report:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChange} picker="year" />
                </Col>
              </Row>
            </Col>
          </div>
          <div className="ant-card-footer">
            {" "}
            <Col
              span={24}
              style={{
                padding: "10px 0px 10px 0px",
                textAlign: "center",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Row>
                <Col span={24}>
                  <Button
                    type="secondary"
                    htmlType="reset"
                    onClick={() => triggerReportSummary()}
                    style={{ margin: "0px 10px 0px 0px" }}
                  >
                    Clear
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => triggerReportSummary()}
                  >
                    Download
                  </Button>
                </Col>
              </Row>
            </Col>
          </div>
        </div>
      </Col>
      <Col span={24}>
        <div className="ant-card ant-card-bordered">
          <div
            className="ant-card-head"
            style={{ backgroundColor: "#fafafa", minHeight: "35px" }}
          >
            <div className="ant-card-head-wrapper">
              <div className="ant-card-head-title pb-1 pt-1">
                Download Transaction by Status
              </div>
            </div>
          </div>
          <div
            className="ant-card-body"
            style={{ padding: "10px 10px 0px 24px" }}
          >
            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}> Select Status:</Col>
                <Col span={10}>
                  <Select
                    placeholder="Select a status"
                    style={{ width: 150 }}
                    onChange={handleChange}
                    options={[
                      { value: "Cancelled", label: "Cancelled" },
                      { value: "Completed", label: "Completed" },
                      { value: "In progress	", label: "In progress" },
                    ]}
                  />
                </Col>
              </Row>
            </Col>
          </div>
          <div className="ant-card-footer">
            {" "}
            <Col
              span={24}
              style={{
                padding: "10px 0px 10px 0px",
                textAlign: "center",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Row>
                <Col span={24}>
                  <Button
                    type="secondary"
                    htmlType="reset"
                    onClick={() => triggerReportSummary()}
                    style={{ margin: "0px 10px 0px 0px" }}
                  >
                    Clear
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => triggerReportSummary()}
                  >
                    Download
                  </Button>
                </Col>
              </Row>
            </Col>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default AuditSummary;
