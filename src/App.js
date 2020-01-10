import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./Components/Sidebar";
// import { Modal } from "antd";
import Home from "./Page/Home";
import History from "./Page/History";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/history" component={History} />
    </Router>
  );
}

export default App;
