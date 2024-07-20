import React from "react";
import "antd/dist/antd.min.css";
import axios from "axios";
import { Row, Col } from "antd";
import { DatePicker } from "antd";
import { API_ENDPOINTS, config } from "../constants/api.constants";
import dayjs from "dayjs";

export const AuditSummary = () => {
  const onChange = (inputDate) => {
    if (!inputDate) return;
    const date = dayjs(inputDate).format("YYYY-MM-DD");
    const payload = {
      startDate: date,
      endDate: date,
    };
    triggerReportSummary(payload);
  };

  const onChangeWeek = (inputDate) => {
    if (!inputDate) return;
    const startOfWeek = dayjs(inputDate).startOf("week").format("YYYY-MM-DD"); // Start of the week (Sunday)
    const endOfWeek = dayjs(inputDate).endOf("week").format("YYYY-MM-DD"); // End of the week (Saturday)
    const payload = {
      startDate: startOfWeek,
      endDate: endOfWeek,
    };
    triggerReportSummary(payload);
  };

  const onChangeMonth = (inputDate) => {
    if (!inputDate) return;
    const startOfMonth = dayjs(inputDate).startOf("month").format("YYYY-MM-DD");
    const endOfMonth = dayjs(inputDate).endOf("month").format("YYYY-MM-DD");
    const payload = {
      startDate: startOfMonth,
      endDate: endOfMonth,
    };
    triggerReportSummary(payload);
  };

  const onChangeQuarter = (inputDate) => {
    if (!inputDate) return;
    const startOfQuarter = dayjs(inputDate)
      .startOf("quarter")
      .format("YYYY-MM-DD");
    const today = new Date(startOfQuarter);
    const quarter = Math.floor(today.getMonth() / 3);
    const startFullQuarter = new Date(today.getFullYear(), quarter * 3, 1);
    const endFullQuarter = new Date(
      startFullQuarter.getFullYear(),
      startFullQuarter.getMonth() + 3,
      0
    );
    const payload = {
      startDate: startOfQuarter,
      endDate: dayjs(endFullQuarter).endOf("quarter").format("YYYY-MM-DD"),
    };
    triggerReportSummary(payload);
  };

  const onChangeYear = (inputDate) => {
    if (!inputDate) return;
    const startOfYear = dayjs(inputDate).startOf("year").format("YYYY-MM-DD");
    const endOfYear = dayjs(inputDate).endOf("year").format("YYYY-MM-DD");
    const payload = {
      startDate: startOfYear,
      endDate: endOfYear,
    };
    triggerReportSummary(payload);
  };

  const downloadFile = (response) => {
    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: response.data.type });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "Summary_report.xlsx"; // Default file name

    if (contentDisposition) {
      var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      var matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }
    }
    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Replace 'filename.ext' with the desired file name and extension
    // Append the anchor to the body
    document.body.appendChild(a);
    // Trigger a click event on the anchor
    a.click();
    // Remove the anchor from the document
    document.body.removeChild(a);
    // Revoke the object URL
    window.URL.revokeObjectURL(url);
  };

  const triggerReportSummary = (payload) => {
    const AUDIT_SUMMARY = config.url.BASE_URL + API_ENDPOINTS.AUDIT_SUMMARY;
    axios({
      url: AUDIT_SUMMARY, // Replace with your API endpoint
      method: "POST",
      responseType: "blob", // Important for file download
      data: payload,
    }).then((response) => {
      downloadFile(response);
    });
  };

  //   const handleChange = () => console.log("handleChange");

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
                  <DatePicker onChange={onChangeWeek} picker="week" />
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}>Download Monthly Report:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChangeMonth} picker="month" />
                </Col>
              </Row>
            </Col>

            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}> Download Quarterly Report:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChangeQuarter} picker="quarter" />
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ padding: "10px 0px 10px 0px" }}>
              <Row>
                <Col span={4}>Download Yearly Report:</Col>
                <Col span={10}>
                  <DatePicker onChange={onChangeYear} picker="year" />
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
            ></Col>
          </div>
        </div>
      </Col>
      {/*      <Col span={24}>
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
      </Col> */}
    </Row>
  );
};

export default AuditSummary;
