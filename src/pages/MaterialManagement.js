import React, { useState, useEffect } from "react";
// import { Table, Input, InputNumber, Popconfirm, , Typography } from "antd";
// import { Table, Form } from "antd";
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

import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";

export const MaterialManagement = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
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
            name="materialPrice"
            label="Price per Kg"
            rules={[
              {
                required: true,
                message: "Please enter material price per kg",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter="Price per kgs"
              style={{ width: "50%" }}
            />
          </Form.Item>
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
      width: "20%",
      editable: false,
    },
    {
      title: "Material",
      dataIndex: "materialName",
      width: "70%",
      editable: false,
    },
    {
      title: "Price",
      dataIndex: "materialPrice",
      width: "10%",
      editable: false,
    },
    {
      title: "action",
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

  const MaterialGrid = () => {
    return (
      <>
        <Button
          onClick={addMaterial}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Update Material
        </Button>
        <UpdateMaterial />
        <Form form={form} component={false}>
          <Table
            bordered
            dataSource={materials}
            columns={mergedColumns}
            rowClassName="editable-row"
          />
        </Form>
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
  }, [fetchMaterials]);

  return <MaterialGrid />;
};

export default MaterialManagement;
