import React, { Component } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { Select, Input, Button, Modal, Row, Col, Dropdown, Form } from "antd";
import Title from "antd/lib/typography/Title";

export default class Modallogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false,
      visible: false,
      handlingInput: ""
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      handlingInput: "",
      // Reset form data
      fileList: [],
      username: "",
      password: ""
      // Reset form data
    });
  };
  handleChangeInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleLogin() {
    // alert("ok");
    console.log(this.state.username);

    if (this.state.username === "") {
      this.setState({ handlingInput: "* Username Cannot Empty" });
    } else if (this.state.password === "") {
      this.setState({ handlingInput: "* Password Cannot Empty" });
    } else {
      let username = this.state.username;
      let password = this.state.password;
      let login = {
        username,
        password
      };
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ loading: false });
        Axios.post("http://localhost:8000/api/user/login", login)
          .then(res => {
            this.setState({ visible: false });
            console.log(res);
            localStorage.setItem("token", res.data.token);
            Swal.fire("Login Success", "Welcome Admin", "success").then(() => {
              // this.props.getMenuData();
              document.location.href = "/";
            });
          })
          .catch(error => {
            Swal.fire(
              "Login Failed",
              "Wrong username & Password",
              "error"
            ).then(() => {
              // this.props.getMenuData();
              // document.location.href = "/";
            });
            console.log(error);
          });
      }, 3000);
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        {/* <Button type="primary" onClick={this.showModal}>
          Open Modal with customized footer
        </Button> */}
        <Modal
          visible={this.props.visible}
          title="Login"
          footer={[
            <Button key="back" onClick={this.props.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleLogin}
            >
              Submit
            </Button>
          ]}
        >
          <Row>
            <Col span={8}>
              <Title level={3}>Username</Title>
            </Col>
            <Col span={16}>
              <Input
                value={this.state.username}
                name="username"
                onChange={this.handleChangeInput}
                placeholder="Input Username"
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          <Row>
            <Col span={8}>
              <Title level={3}>Password</Title>
            </Col>
            <Col span={16}>
              <Input
                value={this.state.password}
                type="password"
                name="password"
                min={1}
                onChange={this.handleChangeInput}
                placeholder="Input Password"
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
