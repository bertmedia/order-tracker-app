import React, { useEffect, useState } from 'react';
import { MainMenuList } from './MainMenuList';
import { DiamondHalf } from 'react-bootstrap-icons';
import UserInfo from './UserInfo';
import { Orders } from '../order/Orders';
import { Footer } from './Footer';
import Accounts from '../account/Accounts';
import { Dashboard } from './Dashboard';
import { Product } from '../product/Product';
import Login from '../account/Login';
import useToken from '../account/useToken';
import OrdersReport from '../report/OrdersReport';
import AgentsReport from '../report/AgentsReport';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import logo from '../img/shopping-cart2_32.png';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function Landing() {
    const [selectedMenu, setSelectedMenu] = useState('Dashboard');

    const menuSaleServiceData = [{
        'title': 'Orders',
        'path': '/orders'
    }];

    const menuUserData = [
        {
            'title': 'Users',
            'path': '/account-management'
        },
        {
            'title': 'Products',
            'path': '/products'
        },
    ];
    const menuReportData = [
        {
            'title': 'Orders Report',
            'path': '/report/orders'
        },
        {
            'title': 'Agents Report',
            'path': '/report/agents'
        },
    ];

    useEffect(() => {
        if (!sessionStorage.getItem('current-page')) {
            sessionStorage.setItem('current-page', selectedMenu);
        }

    }, [selectedMenu]);

    function showMenu(menuName) {
        if (sessionStorage.getItem('token')) {
            const token = sessionStorage.getItem('token');
            const userToken = JSON.parse(token);

            if (menuName === 'reports') {
                if (userToken.owner === 'true') {
                    return <MainMenuList title={'Reports'} menuList={menuReportData} />;
                }
            } else if (menuName === 'management') {
                if (userToken.organization === 'sys') {
                    return <MainMenuList title={'Manage'} menuList={menuUserData} />
                }
            }

            return '';
        }

        return 'OK';
    }

    const { token, setToken } = useToken();

    if (!token) {
        return <Login setToken={setToken} />
    }

    return (
        <>
            <Row>
                <Col md={2} xs={4} className="main-menu-area">
                    <Row className="app-branding">
                        <Col>
                            <img src={logo} alt="logo" /><button className="btn btn-brand">Order Management</button>
                        </Col>
                    </Row>

                    <MainMenuList title={'Dashboard'} menuList={[]} />

                    <MainMenuList title={'Sales & Services'} menuList={menuSaleServiceData}/>
                    {
                        showMenu('reports')
                    }
                    {
                        showMenu('management')
                    }
                </Col>

                <Col md={10} xs={12} className="main-canvas-area">
                    <UserInfo />
                    <hr />

                    <Router>
                        <Switch>
                            <Route path="/orders">
                                <Orders />
                            </Route>

                            <Route path="/products">
                                <Product />
                            </Route>

                            <Route path="/account-management">
                                <Accounts orgId='sys' />
                            </Route>

                            <Route path="/report/orders">
                                <OrdersReport />
                            </Route>

                            <Route path="/report/agents">
                                <AgentsReport />
                            </Route>

                            <Route path="/">
                                <Dashboard />
                            </Route>

                        </Switch>
                    </Router>

                    <Footer />
                </Col>
            </Row>



        </>
    );

}

export default Landing;