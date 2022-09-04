import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  InputNumber,
  Form,
  Typography,
  notification,
  Button,
  Modal,
} from "antd";
import axios from "axios";
import { Row, Col } from "antd";

import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";

export const MaterialManagement = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  //   const [vatChecked, setVatChecked] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [visible, setVisible] = useState(false);
  const [materialInEdit, setMaterialInEdit] = useState({});
  const [fetchMaterials, setFetchMaterials] = useState(false);

  const openNotificationWithIcon = ({ type, message, description }) => {
    notification[type]({
      message,
      description,
      duration: 5,
    });
  };

  const onCreate = (material) => {
    setVisible(false);
    saveMaterial(material);
  };
  const onCancel = () => {
    setMaterialInEdit({});
    setVisible(false);
  };
  const UpdateMaterial = () => {
    return (
      <Modal
        visible={visible}
        title={
          Object.keys(materialInEdit).length ? "EDIT MATERIAL" : "ADD MATERIAL"
        }
        okText={Object.keys(materialInEdit).length ? "Edit" : "Add"}
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          modalForm
            .validateFields()
            .then((values) => {
              onCreate(values);
              modalForm.resetFields();
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form form={modalForm} layout="vertical" name="updateMaterialModal">
          <Form.Item
            name="materialName"
            label="Material Name"
            rules={[
              {
                required: true,
                message: "Please enter material name",
              },
            ]}
          >
            <Input style={{ width: "50%" }} />
          </Form.Item>
          <Form.Item
            name="materialIncBalePrice"
            label="Incoming Bale Price per Kg"
            rules={[
              {
                required: true,
                message: "Please enter incoming material bale price per kg",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter="Price per kgs"
              style={{ width: "50%" }}
            />
          </Form.Item>
          <Form.Item
            name="materialIncLoosePrice"
            label="Incoming Loose Price per Kg"
            rules={[
              {
                required: true,
                message: "Please enter incoming material loose price per kg",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter="Price per kgs"
              style={{ width: "50%" }}
            />
          </Form.Item>
          <Form.Item
            name="materialOutBalePrice"
            label="Outgoing Bale Price per Kg"
            rules={[
              {
                required: true,
                message: "Please enter outgoing material bale price per kg",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter="Price per kgs"
              style={{ width: "50%" }}
            />
          </Form.Item>
          <Form.Item
            name="materialOutLoosePrice"
            label="Outgoing Loose Price per Kg"
            rules={[
              {
                required: true,
                message: "Please enter outgoing material loose price per kg",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter="Price per kgs"
              style={{ width: "50%" }}
            />
          </Form.Item>
          <Form.Item
            name="vat"
            label="VAT"
            rules={[
              {
                required: true,
                message: "Please enter VAT",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter="Price per kgs"
              style={{ width: "50%" }}
            />
          </Form.Item>
          {/*       <Form.Item>
            <Checkbox  name="enableVat" checked={vatChecked} onChange={onChangeVat}>
                Include VAT in all transactions
            </Checkbox>
         </Form.Item> */}
        </Form>
      </Modal>
    );
  };
  const saveMaterial = (material) => {
    const updatedMaterial = { ...materialInEdit, ...material };
    const url = BASE_URL + API_ENDPOINTS.SAVE_MATERIAL;
    const successObj = {
      type: "info",
      message: "Material Management",
      description: "Materials Updated Successfully",
    };
    axios.post(url, updatedMaterial).then((response) => {
      setFetchMaterials(true);
      openNotificationWithIcon(successObj);
    });
  };

  const addMaterial = () => {
    setMaterialInEdit({});
    setVisible(true);
  };

  const editMaterial = (material) => {
    const { key, ...materialNew } = material;
    setVisible(true);
    setMaterialInEdit(materialNew);
    modalForm.setFieldsValue(materialNew);
  };

  const columns = [
    {
      title: "Material ID",
      dataIndex: "materialId",
      width: "5%",
      editable: false,
    },
    {
      title: "Material",
      dataIndex: "materialName",
      width: "20%",
      editable: false,
    },
    {
      title: "Incoming Bale Price",
      dataIndex: "materialIncBalePrice",
      width: "20%",
      editable: false,
    },
    {
      title: "Incoming Loose Price",
      dataIndex: "materialIncLoosePrice",
      width: "20%",
      editable: false,
    },
    {
      title: "Outgoing Bale Price",
      dataIndex: "materialOutBalePrice",
      width: "20%",
      editable: false,
    },
    {
      title: "Outgoing Loose Price",
      dataIndex: "materialOutLoosePrice",
      width: "10%",
      editable: false,
    },
    {
      title: "VAT",
      dataIndex: "vat",
      width: "5%",
      editable: false,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => editMaterial(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return col;

    /*  return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        inputType: col.dataIndex === "materialPrice" ? "number" : "text",
        title: col.title,
      }),
    }; */
  });

  /*   const onChangeVat = (event) => {
    setVatChecked(event.target.checked);
    //CALL API TO INCLUDE VAT
  }; */

  const MaterialGrid = () => {
    return (
      <>
        <Row>
          <Col span={24}>
            <Button
              onClick={addMaterial}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add a New Material
            </Button>
          </Col>
          {/*      <Col span={24}>
            <Checkbox checked={vatChecked} onChange={onChangeVat}>
              Include VAT in all transactions
            </Checkbox>
          </Col> */}
        </Row>
        <UpdateMaterial />
        <Col span={24} style={{ marginTop: "20px" }}>
          <Form form={form} component={false}>
            <Table
              bordered
              dataSource={materials}
              columns={mergedColumns}
              rowClassName="editable-row"
            />
          </Form>
        </Col>
      </>
    );
  };

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
  }, [fetchMaterials]);

  return <MaterialGrid />;
};

export default MaterialManagement;
