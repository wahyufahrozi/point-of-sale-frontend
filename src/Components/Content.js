import React from "react";
import { Layout, Row, Col, Card, Button, InputNumber, Input, Icon } from "antd";
import axios from "axios";
import Checkout from "./Checkout";
import PaginationPage from "../Components/Pagination";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import Meta from "antd/lib/card/Meta";
import "../Style/Home.css";
import Title from "antd/lib/typography/Title";
import MenuEdit from "./MenuEdit";
// const { Search } = Input;
const { Header, Content, Footer } = Layout;

export default class Contents extends React.Component {
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
      visibleedit: false,
      dataCheckout: [],
      total: 0,
      post: [],
      currentPage: 1,
      postsPerPage: 9,
      search: "",
      dataedit: [],
      handlingInput: "",
      receipt: new Date().getTime().toString(36)
    };
    this.sortByNameAsc = this.sortByNameAsc.bind(this);
    // this.sortByNameDesc = this.sortByNameDesc.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  sendBackData = count => {
    this.props.parentCallback(count + 1);
  };
  removeCartItem(iditem) {
    this.setState({
      cartItem: this.state.cartItem.filter(
        cartcontent => cartcontent.id !== iditem
      )
    });
  }
  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  handleAddcart(data) {
    this.setState(previousState => ({
      cartItem: [...previousState.cartItem, data]
    }));
  }
  IncrementItem = index => {
    const cartItemCopy = this.state.cartItem;
    cartItemCopy[index].qty++;
    this.setState({ cartItem: cartItemCopy });
  };
  DecreaseItem = index => {
    const cartItemCopy = this.state.cartItem;
    cartItemCopy[index].qty--;
    this.setState({ cartItem: cartItemCopy });
  };

  showModal = () => {
    this.setState({
      visible: true,
      dataCheckout: this.state.cartItem
    });
  };
  sortByNameAsc() {
    this.setState(previousState => {
      this.state.products.sort((a, b) => b.name - a.name);
    });
  }
  sortByNameDesc() {
    this.setState(previousState => {
      this.state.products.sort((a, b) => a.name - b.name);
    });
  }
  hideModal = () => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2
    });

    const total = this.state.cartItem.reduce(
      (totals, sum) => totals + sum.qty * sum.price,
      0
    );
    const ppn = total * 0.1;
    let check = [];
    this.setState({
      visible: false
    });
    this.state.cartItem.map((content, index) => {
      check.push(content.name);
      // console.log("test", check);

      return console.log("coba", content.name);
    });
    let newCheck = check.toString();
    let form = {
      name: newCheck,
      total: total,
      ppn: ppn,
      receipt: this.state.receipt
    };
    axios
      .post("http://localhost:8000/api/order/", form)
      .then(res => {
        Swal.fire("Transaction Success", "Print Transaction", "success").then(
          () => {
            // document.location.href = "/";
            var doc = new jsPDF();
            let space = 10;
            doc.text(`Receipt Code ${this.state.receipt}`, 10, (space += 10));
            this.state.dataCheckout.map(data => {
              console.log("coba", this.state.dataCheckout);

              doc.text(
                `${data.name}  Rp. ${formatter.format(data.price)}`,
                10,
                (space += 10)
              );
            });
            doc.text(`Total Rp. ${formatter.format(total)}`, 10, (space += 10));
            doc.text(`Payment Cash`, 10, (space += 10));
            doc.save(`${this.state.receipt}.pdf`);
          }
        );
      })
      .catch(error => {
        console.log(error);
      }, 3000);
  };
  // document.location.href("/");

  componentDidMount() {
    axios
      .get("http://localhost:8000/api/product/")
      .then(response => {
        // console.log(response.data);
        this.setState({
          products: response.data.message
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  showModalEdit = item => {
    this.setState({
      visibleedit: true,
      dataedit: item
    });
    console.log("ini menu", item);
    this.refs.childedit.getdataedit(item);
    // console.log("items:", item);
  };

  hideModalEdit = () => {
    this.setState({
      visibleedit: false
    });
  };
  handleChangeSearch(e) {
    e.preventDefault();
    // console.log("COba", e.target.value);

    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSearch() {
    if (this.state.search === "") {
      this.setState({
        handlingInput: "Please Input"
      });
    } else {
      axios
        .get(`http://localhost:8000/api/product/search/${this.state.search}`)
        .then(response => {
          console.log("respon searc", response);
          this.setState({
            products: response.data.result
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  render() {
    // if (getData.value.data.status === 200) {
    //   setMaxProduct(getData.value.data.result.infoPage.totalAllProduct);
    // } else {
    //   setMaxProduct(0);
    // }
    const token = localStorage.getItem("token");

    const indexOflastpost = this.state.currentPage * this.state.postsPerPage;
    const indexOffirstPost = indexOflastpost - this.state.postsPerPage;
    const currentPost = this.state.products.slice(
      indexOffirstPost,
      indexOflastpost
    );
    // console.log("ini data product dari database ", this.state.products);

    const total = this.state.cartItem.reduce(
      (totals, sum) => totals + sum.qty * sum.price,
      0
    );

    const ppn = total * 0.1;

    // console.log("Ini cart:", this.state.cartItem);
    const { size } = this.state;
    // console.log("teeeeeeeeeest", this.state.cartItem);
    // const dataCheckout = this.state.cartItem;
    // console.log(this.state.dataCheckout, "checkxxxxxxxxxxxxxxxxxxxxxx");
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2
    });
    console.log("coba", this.state.products);
    return (
      <Layout>
        {/* <button onClick={this.sortByNameAsc}>Aflopend</button>
        <button onClick={this.sortByNameDesc}>Oplopend</button> */}

        <MenuEdit
          ref="childedit"
          dataedit={this.state.dataedit}
          visibleedit={this.state.visibleedit}
          handleCancel={this.hideModalEdit}
        />
        <Checkout
          ppn={ppn}
          total={total}
          dataCheckout={this.state.cartItem}
          receipt={this.state.receipt}
          visible={this.state.visible}
          handleOk={this.hideModal}
          handleCancel={this.hideModal}
        />
        <Header style={{ background: "#fff", padding: 0 }}>
          <Row>
            <Col span={11}>
              <div>
                {/* <Icon type="ordered-list" /> */}
                <h3
                  style={{
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  Food Items
                </h3>
              </div>
            </Col>
            <Col span={4}>
              <Input
                placeholder={
                  this.state.handlingInput === ""
                    ? "input search text"
                    : this.state.handlingInput
                }
                value={this.state.search}
                name="search"
                // onPressEnter={this.handleSearch}
                onChange={this.handleChangeSearch}
                style={{ width: 200 }}
              />
              <Button onClick={this.handleSearch}>
                <Icon type="search" />
              </Button>
            </Col>
            <Col span={9}>
              <h3
                style={{
                  textAlign: "center",
                  fontWeight: "bold"
                }}
              >
                Cart
              </h3>
            </Col>
          </Row>
        </Header>

        <Row>
          <Col span={16}>
            <Content style={{ margin: "40px 16px 0" }}>
              <div
                style={{
                  padding: 24,
                  background: "#fff",
                  Height: "1040px"
                }}
              >
                <Row gutter={16}>
                  {currentPost.map((d, index) => {
                    return (
                      <Col span={8}>
                        <Card
                          key={index}
                          hoverable
                          style={{
                            width: 240,
                            marginBottom: 20,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                          }}
                          cover={
                            <img
                              onClick={() =>
                                this.state.cartItem.filter(
                                  cart => d.id === cart.id
                                ).length > 0
                                  ? null
                                  : this.handleAddcart({
                                      ...d,
                                      qty: 1
                                    })
                              }
                              alt="example"
                              src={d.image}
                              style={{
                                opacity:
                                  this.state.cartItem.filter(
                                    cart => d.id === cart.id
                                  ).length > 0
                                    ? 0.5
                                    : "",
                                backgroundColor:
                                  this.state.cartItem.filter(
                                    cart => d.id === cart.id
                                  ).length > 0
                                    ? "black"
                                    : "",
                                height: 200,
                                objectFit: "cover",
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10
                              }}
                            />
                          }
                        >
                          <Meta
                            title={d.name}
                            description={formatter.format(d.price)}
                          />
                          {token ? (
                            <div style={{ paddingTop: "10%" }}>
                              <Button
                                type="primary"
                                style={{ width: "100%" }}
                                onClick={() => {
                                  this.showModalEdit(d);
                                }}
                              >
                                Edit
                              </Button>

                              {/* &nbsp; */}
                              {/* <Button>Delete</Button> */}
                            </div>
                          ) : null}

                          {this.state.cartItem.filter(cart => d.id === cart.id)
                            .length > 0 && (
                            <img
                              style={{
                                position: "absolute",
                                bottom: "50%",
                                left: "25%",
                                paddingLeft: 10
                              }}
                              width="50%"
                              src="https://image.flaticon.com/icons/png/512/443/443138.png"
                            />
                          )}
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
                <Row>
                  <Col>
                    <PaginationPage
                      currentPage={this.state.currentPage}
                      totalPosts={this.state.products.length}
                      postsPerPage={this.state.postsPerPage}
                      paginate={pagenumbers =>
                        this.setState({
                          currentPage: pagenumbers
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Content>
          </Col>
          <Col span={7}>
            <Content style={{ margin: "24px 16px 0" }}>
              <div className="itemconfiguration">
                <div
                  style={{
                    padding: 24,
                    background: "#fff",
                    Height: "700px",
                    marginTop: "17px"
                  }}
                >
                  {this.state.cartItem.length > 0 ? (
                    this.state.cartItem.map((cartcontent, index) => {
                      return (
                        <Row gutter={[16, 16]}>
                          <Card
                            title={cartcontent.name}
                            bordered={false}
                            extra={
                              <a
                                onClick={() =>
                                  this.removeCartItem(cartcontent.id)
                                }
                              >
                                Remove
                              </a>
                            }
                            style={{ width: "100%" }}
                          >
                            <Col span={12}>
                              <img
                                src={cartcontent.image}
                                style={{ width: "100%" }}
                              />
                              <br />
                              <br />
                              <Row>
                                <Col span={15}>
                                  <Title level={4}>Subtotal</Title>
                                </Col>
                                <Col span={5}>
                                  <Title level={4}>
                                    <p>
                                      {cartcontent.qty == 0
                                        ? this.removeCartItem(cartcontent.id)
                                        : formatter.format(
                                            cartcontent.price * cartcontent.qty
                                          )}
                                    </p>
                                  </Title>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={12}>
                              <Row gutter={[8, 8]}>
                                <Col span={6}>
                                  <Button
                                    onClick={() => this.DecreaseItem(index)}
                                    size="small"
                                  >
                                    -
                                  </Button>
                                </Col>
                                <Col span={9}>
                                  <InputNumber
                                    onChange={this.state.clicks}
                                    size="small"
                                    style={{
                                      width: "40px"
                                    }}
                                    min={1}
                                    max={100000}
                                    value={cartcontent.qty}
                                  />
                                </Col>
                                <Col span={7}>
                                  <Button
                                    size="small"
                                    onClick={() => this.IncrementItem(index)}
                                  >
                                    +
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                          </Card>
                        </Row>
                      );
                    })
                  ) : (
                    <div style={{ paddingTop: "40%" }}>
                      <img
                        src={require("../Assets/cartempty.png")}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Content>
          </Col>
        </Row>
        <Row>
          <Col span={16}></Col>

          <Col
            span={8}
            style={{
              marginTop: "-20%",
              backgroundColor: "none",
              width: "30%"
            }}
          >
            {this.state.cartItem.length > 0 ? (
              <Card style={{ width: "100%", marginTop: "10%" }}>
                <Row>
                  <Col span={16}>
                    <Title level={4}>Total : </Title>
                  </Col>
                  <Col span={4}>
                    <Title level={4}>{formatter.format(total)}*</Title>
                  </Col>
                </Row>

                <h3>*Belum Termasuk PPN</h3>

                <Button
                  onClick={this.showModal}
                  type="primary"
                  style={{
                    width: "100%",
                    marginBottom: 10
                  }}
                >
                  Checkout
                </Button>
                <Button
                  style={{
                    width: "100%"
                  }}
                  type="danger"
                >
                  Cancel
                </Button>
              </Card>
            ) : (
              <Card style={{ width: "100%", marginTop: "30%" }}>
                <Button
                  disabled
                  type="primary"
                  style={{
                    width: "100%",
                    marginBottom: 10
                  }}
                >
                  Checkout
                </Button>
                <Button
                  disabled
                  style={{
                    width: "100%"
                  }}
                  type="danger"
                >
                  Cancel
                </Button>
              </Card>
            )}
          </Col>
        </Row>
      </Layout>
    );
  }
}
