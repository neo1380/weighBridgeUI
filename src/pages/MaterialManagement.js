import React, { useState, useEffect } from "react";
// import { Table, Input, InputNumber, Popconfirm, , Typography } from "antd";
// import { Table, Form } from "antd";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Button,
} from "antd";

import { API_ENDPOINTS, BASE_URL } from "../constants/api.constants";

export const MaterialManagement = () => {
  const [form] = Form.useForm();
  const [materials, setMaterials] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      materialPrice: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const saveMaterial = (material) => {
    const { key, ...updatedMaterial } = material;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMaterial),
    };
    fetch(BASE_URL + API_ENDPOINTS.GET_MATERIAL, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log("post", data));
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const index = materials.findIndex((item) => record.key === item.key);

      if (index > -1) {
        const updatedRecord = { ...materials[index], ...row };
        materials.splice(index, 1, { ...updatedRecord });
        setMaterials(materials);
        saveMaterial(updatedRecord);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const cancel = () => {
    setEditingKey("");
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
      editable: true,
    },
    {
      title: "action",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="link" size={"small"}>
                Cancel
              </Button>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "number" ? <InputNumber min={0} /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        inputType: col.dataIndex === "materialPrice" ? "number" : "text",
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const MaterialGrid = () => {
    return (
      <Form form={form} component={false}>
        <Table
          bordered
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={materials}
          columns={mergedColumns}
          pagination={{ position: ["none"] }}
          rowClassName="editable-row"
        />
      </Form>
    );
  };

  useEffect(() => {
    const materialList = BASE_URL + API_ENDPOINTS.GET_MATERIAL;
    fetch(materialList)
      .then((response) => response.json())
      .then((materials) => {
        if (materials && materials.length) {
          materials.map((material, index) => (material.key = index.toString()));
          console.log(materials);
          setMaterials(materials);
        }
      });
  }, []);

  return <MaterialGrid />;
};

export default MaterialManagement;
