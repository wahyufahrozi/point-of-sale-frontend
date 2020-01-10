import React from "react";
import { Layout, Menu, Icon, Table, Divider, Tag } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

import Modaladd from "./Modaladd";
import Modallogin from "./Modallogin";
import "../Style/Home.css";
import "../Style/pagination.css";
import Logout from "./Logout";
import PaginationPage from "./Pagination";
const { Sider } = Layout;

export default class Contenthistory extends React.Component {
  constructor(props) {
    super();
    this.state = {
      collapsed: false,
      show: true,
      size: "large",
      visible: false,
      visiblelogin: false,
      visiblelogout: false,
      transaksi: [],
      currentPage: 1,
      postsPerPage: 9
    };
  }
  showModalLogout = () => {
    this.setState({
      visiblelogout: true
    });
  };

  hideModalLogout = () => {
    this.setState({
      visiblelogout: false
    });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  hideModal = () => {
    this.setState({
      visible: false
    });
  };
  showModallogin = () => {
    this.setState({
      visiblelogin: true
    });
  };

  hideModallogin = () => {
    this.setState({
      visiblelogin: false
    });
  };
  sendBackData = count => {
    this.props.parentCallback(count + 1);
  };

  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  componentDidMount() {
    axios
      .get("http://localhost:8000/api/order/")
      .then(response => {
        // console.log(response.data);
        this.setState({
          transaksi: response.data.result
        });
        console.log("ini data transaksi", this.state.transaksi);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    const indexOflastpost = this.state.currentPage * this.state.postsPerPage;
    const indexOffirstPost = indexOflastpost - this.state.postsPerPage;
    const currentPost = this.state.transaksi.slice(
      indexOffirstPost,
      indexOflastpost
    );
    // console.log("ini data product dari database ", this.state.transaksi);
    const token = localStorage.getItem("token");

    // console.log("Ini cart:", this.state.cartItem);
    const { size } = this.state;

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Modaladd
          visible={this.state.visible}
          handleOk={this.handleOk}
          handleCancel={this.hideModal}
        />
        <Modallogin
          visible={this.state.visiblelogin}
          handleCancel={this.hideModallogin}
        />
        <Logout
          visible={this.state.visiblelogout}
          handleCancel={this.hideModalLogout}
        />
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Link to="/">
                <Icon type="shopping-cart" />
                <span>Food</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={"/history"}>
                <Icon type="history" />
                <span>History</span>
              </Link>
            </Menu.Item>
            <Menu.Item onClick={this.showModal}>
              <Icon type="plus" />
              <span>Add</span>
            </Menu.Item>
            {token ? (
              <Menu.Item onClick={this.showModalLogout}>
                <Icon type="logout" />
                <span>Logout</span>
              </Menu.Item>
            ) : (
              <Menu.Item onClick={this.showModallogin}>
                <Icon type="user" />
                <span>Login Admin</span>
              </Menu.Item>
            )}
          </Menu>
        </Sider>

        <table
          style={{ width: "80%", marginLeft: "2%", backgroundColor: "white" }}
        >
          <thead>
            <tr>
              <th>Transaction Code</th>
              <th>Orders</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentPost.map((d, index) => {
              return (
                <tr>
                  <td>{d.receipt}</td>
                  <td>{d.name}</td>
                  <td>{d.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <PaginationPage
          className="pagination-transaction"
          currentPage={this.state.currentPage}
          totalPosts={this.state.transaksi.length}
          postsPerPage={this.state.postsPerPage}
          paginate={pagenumbers =>
            this.setState({
              currentPage: pagenumbers
            })
          }
        />
      </Layout>
    );
  }
}
