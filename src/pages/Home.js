import { Component } from "react";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";
import axios from "axios";
import { Layout, Menu } from "antd";
import {
  DeploymentUnitOutlined,
  DollarOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { HeaderComp } from "../Header";
import { WeighManagement } from "./WeightManagement";
import { TransactionHistory } from "./TransactionHistory";
import { NotFound } from "./NotFound";
import { Login } from "./Login";
import { EmployeeManagement } from "./EmployeeManagement";
import { MaterialManagement } from "./MaterialManagement";
import { OrderSummary } from "./OrderSummary";
import { OnGoingTransactions } from "./OngoingTransactions";
import { UserContext } from "../contexts/UserContexts";

import { API_ENDPOINTS, AUTH_URL } from "../constants/api.constants";

const { Sider, Content } = Layout;

export class Home extends Component {
  state = {
    collapsed: false,
    isLoggedIn: false,
    user: null,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  loginHandler = (values) => {
    const loginUrl = AUTH_URL + API_ENDPOINTS.LOGIN;
    axios.post(loginUrl, values).then(({ data }) => {
      if (data && typeof data.token !== "undefined") {
        this.getUserDetails(data.token, values);
      }
    });
  };

  getUserDetails = (token, { emp_id }) => {
    const url = AUTH_URL + API_ENDPOINTS.USER + `${emp_id}`;
    window.localStorage.setItem("token", token);
    axios.get(url).then(({ data }) => {
      this.setState({ user: data.user });
      this.setState({ isLoggedIn: true });
    });
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        {!this.state.isLoggedIn ? (
          <Layout>
            <Content className="site-layout-background">
              <Login onLoginHandler={this.loginHandler} />
            </Content>
          </Layout>
        ) : (
          <UserContext.Provider value={this.state.user}>
            <Router>
              <HeaderComp />
              <Layout>
                <Sider
                  width={250}
                  breakpoint="lg"
                  collapsedWidth="0"
                  onBreakpoint={(broken) => {
                    console.log(broken);
                  }}
                  onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                  }}
                  className="site-layout-background hide-print"
                >
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
                      <Link to="/employee">Employee Management</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<DollarOutlined />}>
                      <Link to="/transactions">Transactions</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<DeploymentUnitOutlined />}>
                      <Link to="/weighm">Weight Management</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<GlobalOutlined />}>
                      <Link to="/material"> Material Management</Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<GlobalOutlined />}>
                      <Link to="/ongoing"> Ongoing Transactions</Link>
                    </Menu.Item>
                    {/*    <Menu.Item key="6" icon={<GlobalOutlined />}>
                            <Link to="/summary"> Order Summary</Link>
                        </Menu.Item> */}
                  </Menu>
                </Sider>

                <Layout
                  style={{
                    padding: "24px",
                  }}
                >
                  <Content
                    className="site-layout-background"
                    style={{
                      padding: 24,
                      margin: 0,
                    }}
                  >
                    <Routes>
                      <Route exact path="/" element={<WeighManagement />} />
                      <Route
                        exact
                        path="/transactions"
                        element={<TransactionHistory />}
                      />
                      <Route
                        exact
                        path="/employee"
                        element={<EmployeeManagement />}
                      />
                      <Route
                        exact
                        path="/weighm"
                        element={<WeighManagement />}
                      />
                      <Route
                        exact
                        path="/material"
                        element={<MaterialManagement />}
                      />
                      <Route
                        exact
                        path="/summary/:id"
                        element={<OrderSummary />}
                      />
                      <Route
                        exact
                        path="/ongoing"
                        element={<OnGoingTransactions />}
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            </Router>
          </UserContext.Provider>
        )}
      </Layout>
    );
  }
}

export default Home;
