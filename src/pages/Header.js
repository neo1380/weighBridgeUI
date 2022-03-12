import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

export const HeaderComp = () => {
  return (
    <Layout>
      <Header className="header">
        <div className="logo">Al Dakheel Carton Factory</div>
      </Header>
    </Layout>
  );
};
