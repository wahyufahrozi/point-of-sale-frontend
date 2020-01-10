import React from "react";
import Contents from "./Content";
import {
  Layout,
  Menu,
  Breadcrumb,
  Icon,
  Row,
  Col,
  Card,
  Button,
  InputNumber
} from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

import Modaladd from "../Components/Modaladd";
import Modallogin from "../Components/Modallogin";
import "../Style/Home.css";
import Logout from "./Logout";
const { Sider } = Layout;

export default class Sidebar extends React.Component {
  constructor(props) {
    super();
    this.state = {
      collapsed: false,
      cartItem: [],
      products: [],
      clicks: 0,
      show: true,
      size: "large",
      visible: false,
      visiblelogin: false,
      visiblelogout: false
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
  // removeCartItem(iditem) {
  //   this.setState({
  //     cartItem: this.state.cartItem.filter(
  //       cartcontent => cartcontent.id !== iditem
  //     )
  //   });

  //   // this.props.parentCallback(count + 1)
  // }
  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  // handleAddcart(data) {
  //   this.setState(previousState => ({
  //     cartItem: [...previousState.cartItem, data]
  //   }));
  // }
  // IncrementItem = index => {
  //   const cartItemCopy = this.state.cartItem;
  //   cartItemCopy[index].qty++;
  //   this.setState({ cartItem: cartItemCopy });
  // };
  // DecreaseItem = index => {
  //   const cartItemCopy = this.state.cartItem;
  //   cartItemCopy[index].qty--;
  //   this.setState({ cartItem: cartItemCopy });
  // };
  componentDidMount() {
    axios
      .get("http://localhost:8000/api/product/")
      .then(response => {
        console.log(response.data);
        this.setState({ products: response.data.message });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    // console.log("ini data product dari database ", this.state.products);
    const token = localStorage.getItem("token");

    const total = this.state.cartItem.reduce(
      (totals, sum) => totals + sum.qty * sum.price,
      0
    );

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
              <Link to="/history">
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
        <Contents />
      </Layout>
    );
  }
}
