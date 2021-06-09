import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ava from '../img/user2.png';
import { useState, useEffect } from 'react';
import useToken from '../account/useToken';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

function UserInfo() {
    const [pageTitle, setPageTitle] = useState('Dashboard');
    const { token, setToken } = useToken();
    const [fullName, setFullName] = useState('User');

    useEffect(() => {
        setPageTitle(sessionStorage.getItem('current-page'));

        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);

        setFullName(userToken.fullName);
    }, []);

    const handleLogout = (e) => {
        setToken({});

        let base_url = window.location.origin;
        window.location.replace(base_url);
    }

    return (
        <Row>
            <Col className="justify-content-left selected-page">{pageTitle}</Col>
            <Col className="user-profile-action text-right">
                <div className="avatar-pic">

                    <ButtonGroup>
                        <small>Welcome, {fullName}!</small>&nbsp;&nbsp;
                        <img src={ava} alt="user-avatar" />
                        <DropdownButton as={ButtonGroup} title="" id="bg-nested-dropdown" className="logged-user-actions">
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </DropdownButton>
                    </ButtonGroup>

                </div>
            </Col>
        </Row>
    );

}

export default UserInfo;