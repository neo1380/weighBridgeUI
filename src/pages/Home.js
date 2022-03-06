import { Component } from "react";
import { Layout, Menu } from "antd";
import {
  DeploymentUnitOutlined,
  DollarOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { WeighManagement } from "./WeightManagement";

const { Header, Sider, Content } = Layout;
export class Home extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Header className="header">
          <div className="logo">Al Dakheel Carton Factory</div>
          <Menu
            style={{ justifyContent: "flex-end" }}
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={250} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={["4"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<AppstoreOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="2" icon={<UsergroupAddOutlined />}>
                Employee Management
              </Menu.Item>
              <Menu.Item key="3" icon={<DollarOutlined />}>
                Transactions
              </Menu.Item>
              <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
                Weight Management
              </Menu.Item>
              <Menu.Item key="5" icon={<GlobalOutlined />}>
                Material Management
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <WeighManagement />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default Home;
