import React from "react";
import { Col, Row } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/Nav.css";
import { removeLocalStorage } from "../../utils/helper";
import logo from "../../images/logo.svg"

const Nav = () => {
  const navigate = useNavigate();
  return (
    <div className="Nav">
      <Row className="NavRow">
        <Col md={1} sm={3} xs={4}></Col>

        <Col md={6} sm={3} xs={1} className="LogoCol">
          <img className="NavLogo" src={logo} alt="" />
        </Col>

        <Col md={8} sm={4} xs={4}></Col>

        <Col md={9} sm={12} xs={15} className="NavList">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active nav_items" : "nav_items"
            }
          >
            <p>This Month</p>
          </NavLink>

          <NavLink
            to="/monthly-log"
            className={({ isActive }) =>
              isActive ? "active nav_items" : "nav_items"
            }
          >
            <p>Monthly Log</p>
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
            to="/privacy-policy"
            className={({ isActive }) =>
              isActive ? "active nav_items" : "nav_items"
            }
          >
            <p>Privacy Policy</p>
          </NavLink>
          

              <button
                onClick={() => {
                  removeLocalStorage("token");
                  navigate("/login");
                }}
                className="LogOutBtn"
              >
                Log out
              </button>
        </Col>
      </Row>
    </div>
  );
};

export default Nav;
