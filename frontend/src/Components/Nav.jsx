import React from 'react'
import { Col, Row } from 'antd'
import { Link } from 'react-router-dom';
import "../styles/Nav.css"

const Nav = () => {
    return (
        <div className='Nav'>
            <Row>
                <Col md={1}>
                    <img className='Navlogo' src="./capture.png" alt="" />
                </Col>
                <Col md={8}>
                    <p className='NavText'>Advertising Pricing tool</p>
                </Col>
                <Col md={9}></Col>
                <Col md={5} className="NavList">
                    <Link to="/" className='nav_items'>
                        <p>Home</p>
                    </Link>
                    <Link to="/OverUnderlog" className='nav_items'>
                        <p>Over/Under Log</p>
                    </Link>
                    <p><u>Log out</u></p>
                </Col>
            </Row>
        </div>
    )
}

export default Nav