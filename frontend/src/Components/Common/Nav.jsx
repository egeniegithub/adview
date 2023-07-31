import React from "react";
import { Col, Row } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/Nav.css";
import { removeLocalStorage } from "../../utils/helper";

const Nav = () => {
  const navigate = useNavigate();
  return (
    <div className="Nav">
      <Row>
        <Col md={1} sm={3} xs={1}>
          <img className="NavLogo" src="./capture.png" alt="" />
        </Col>
        <Col md={8} sm={3} xs={4}>
          <p className="NavText">Advertising Pricing tool</p>
        </Col>
        <Col md={9} sm={4} xs={4}></Col>
        <Col md={5} sm={12} xs={15} className="NavList">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active nav_items" : "nav_items"
            }
          >
            <p>This Month</p>
          </NavLink>
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              isActive ? "active nav_items" : "nav_items"
            }
          >
            <p>Accounts</p>
          </NavLink>
          <NavLink
            to="/monthly-log"
            className={({ isActive }) =>
              isActive ? "active nav_items" : "nav_items"
            }
          >
            <p>Monthly Log</p>
          </NavLink>

          <p className="nav_items">
            <u>
              <button
                onClick={() => {
                  removeLocalStorage("token");
                  navigate("/login");
                }}
                style={{ whiteSpace: "nowrap" }}
              >
                Log out
              </button>
            </u>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Nav;
