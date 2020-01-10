import React, { Component } from "react";
import { Modal, Row, Col, Input, Form, Button } from "antd";
import { Typography } from "antd";
import { Select } from "antd";
import Axios from "axios";
import Swal from "sweetalert2";

const { Option } = Select;
const { Title } = Typography;

export default class MenuEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loading1: false,
      visible: false,
      handlingInputerror: ""
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handlecategory = this.handlecategory.bind(this);
    this.handleEditMenu = this.handleEditMenu.bind(this);
    this.handleDeleteMenu = this.handleDeleteMenu.bind(this);
  }
  // showModalEdit = item => {
  //   console.log("itemodal:", item);

  //   // this.setState({
  //   //   visible: true,
  //   //   id: id,
  //   //   name: name,
  //   //   price: price,
  //   //   category: category,
  //   //   image: image
  //   // });
  // };

  componentDidMount() {
    this.getdataedit();
  }

  getdataedit(item) {
    // console.log("ini itemmmmmmmmmmmm", item);
    if (item) {
      this.setState({
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        id: item.id
      });
    }
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      previewVisible: false,
      handlingInputerror: ""
    });
  };
  handleChangeInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handlecategory(value) {
    this.setState({
      category: value
    });
  }
  handleDeleteMenu() {
    let id = this.state.id;
    this.setState({ loading1: true });
    setTimeout(() => {
      this.setState({ loading1: false, visible: false });
      Axios.delete(`http://localhost:8000/api/product/${id}`)
        .then(() => {
          Swal.fire("Delete Success", "Menu Has Been deleted", "success").then(
            () => {
              document.location.href = "/";
            }
          );
        })
        .catch(error => {
          console.log(error);
        });
    }, 3000);
  }

  handleEditMenu() {
    let id = this.state.id;
    if (this.state.name === "") {
      this.setState({ handlingInputerror: "Name Cannot Be empty" });
    } else if (this.state.price === "" || this.state.price < 1) {
      this.setState({ handlingInputerror: "Price Cannot Be Empty" });
    } else if (this.state.category === "") {
      this.setState({ handlingInputerror: "Category Cannot Be empty" });
    } else if (this.state.image === "") {
      this.setState({ handlingInputerror: "Image Cannot Be empty" });
    } else {
      const newMenu = {
        name: this.state.name,
        price: this.state.price,
        image: this.state.image,
        category: this.state.category
      };
      this.setState({ loading: true });
      setTimeout(() => {
        Axios.put(`http://localhost:8000/api/product/${id}`, newMenu)
          .then(() => {
            Swal.fire("Edit Success", "Edit Menu Succesfully", "success").then(
              () => {
                document.location.href = "/";
              }
            );
          })
          .catch(error => {
            console.log(error);
          });
      }, 300);
    }
  }
  render() {
    // console.log("ini data edit di modal:", this.props.dataedit.id);

    const { visible, loading, loading1 } = this.state;
    return (
      <div>
        <Modal
          title="Menu"
          visible={this.props.visibleedit}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleEditMenu}
            >
              Update
            </Button>,
            <Button
              style={{ float: "left", marginRight: "1%" }}
              key="submit"
              type="danger"
              loading={loading1}
              onClick={this.handleDeleteMenu}
            >
              Delete
            </Button>,
            <p style={{ fontSize: 13, color: "red", float: "left" }}>
              {this.state.handlingInput}
            </p>
          ]}
          onCancel={this.props.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <Title level={4}>Name</Title>
              </Col>
              <Col span={14}>
                <Input
                  size="large"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChangeInput}
                  placeholder="Please Input Name"
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={6}>
                <Title level={4}>Image</Title>
              </Col>
              <Col span={14}>
                <Input
                  size="large"
                  name="image"
                  value={this.state.image}
                  onChange={this.handleChangeInput}
                  placeholder="Enter Url"
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col span={6}>
                <Title level={4}>Price</Title>
              </Col>
              <Col span={14}>
                <Input
                  size="large"
                  name="price"
                  value={this.state.price}
                  onChange={this.handleChangeInput}
                  placeholder="Price"
                />
              </Col>
            </Row>
            <br />

            <Row>
              <Col span={6}>
                <Title level={4}>Category</Title>
              </Col>
              <Col span={14}>
                <Select
                  onChange={this.handlecategory}
                  value={this.state.category}
                  name="category"
                  placeholder="Category"
                  style={{ width: "100%" }}
                  // onChange={handleChange}
                >
                  <Option value="Food">Food</Option>
                  <Option value="Drink">Drink</Option>
                </Select>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
