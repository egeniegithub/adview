import React from 'react'
import { Col, Row } from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Nav.css"

const Nav = () => {
    const navigate = useNavigate()
    return (
        <div className='Nav'>
            <Row>
                <Col md={1} sm={3} xs={1}>
                    <img className='Navlogo' src="./capture.png" alt="" />
                </Col>
                <Col md={8} sm={3} xs={4}>
                    <p className='NavText'>Advertising Pricing tool</p>
                </Col>
                <Col md={9} sm={4} xs={4}></Col>
                <Col md={5} sm={12} xs={15} className="NavList">
                    <Link to="/" className='nav_items'>
                        <p>This Month</p>
                    </Link>
                    <Link to="/accounts" className='nav_items'>
                        <p>Accounts</p>
                    </Link>
                    <Link to="/OverUnderlog" className='nav_items'>
                        <p>Monthly Log</p>
                    </Link>
                    
                    <p className='nav_items'><u><button onClick={()=>{localStorage.removeItem('token');navigate('/login')}} style={{whiteSpace:"nowrap"}}>Log out</button></u></p>
                </Col>
            </Row>
        </div>
    )
}

export default Nav