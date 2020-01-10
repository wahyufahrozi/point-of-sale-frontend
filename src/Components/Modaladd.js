import React, { Component } from "react";
import Axios from "axios";
import { Select, Input, Button, Modal, Row, Col, Dropdown, Form } from "antd";
import Title from "antd/lib/typography/Title";
const { Option } = Select;

export default class Modaladd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      image: "",
      price: "",
      category: "",

      data: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleChangeCategory(value) {
    // e.preventDefault();
    this.setState({
      category: value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    let data = {
      name: this.state.name,
      image: this.state.image,
      price: this.state.price,
      category: this.state.category
    };
    console.log(data, "data input");

    Axios.post("http://localhost:8000/api/product", data)
      .then(function(response) {
        console.log(response);
        document.location.href = "/";
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        <Modal
          title="Add Menu"
          visible={this.props.visible}
          onOk={this.handleSubmit}
          //   onOk={this.props.handleOk}
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
                  onChange={this.handleChange}
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
                  onChange={this.handleChange}
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
                  onChange={this.handleChange}
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
                  onChange={this.handleChangeCategory}
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
