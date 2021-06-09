import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

async function loginUser(credentials) {
    //const uri = "https://order-tracker-system.herokuapp.com/login";
    const uri="http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/login";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("username", credentials.username);
    urlencoded.append("password", credentials.password);

    console.log(urlencoded);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    return fetch(uri, requestOptions)
    .then(data => data.json())

    /*return fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())*/
}


export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [validated, setValidated] = useState(false);

    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();

        if (form.checkValidity() === false) {
            alert('The username and password maybe incorrect.');
        } else {
            const token = await loginUser({
                username,
                password
            });

            if(token.token === '') {
                alert("Please provide a valid username and/or password.")
            } else {
                setToken(token);
            }
        }

        setValidated(true);
    }

    return (
        <div className="text-left">
            <div className="login-wrapper">
                <h5>Log In to Dashboard</h5>
                <br />
                <Form noValidate validate={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId="formLoginUserId">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="text" placeholder="Enter your user id." onChange={e => setUserName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId="formLoginPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your password." onChange={e => setPassword(e.target.value)} required />
                    </Form.Group>

                    <Button variant="primary" type="submit">Submit</Button>
                </Form>

            </div>
        </div>

    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};