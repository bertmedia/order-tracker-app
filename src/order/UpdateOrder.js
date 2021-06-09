import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function UpdateOrder(props) {
    useEffect(() => {
        setToggleEdit(props.showModal);
        setOrder(props.orderData);

    }, [props.showModal, props.orderData]);

    const [toggleEdit, setToggleEdit] = useState(false);
    const [order, setOrder] = useState({});


    const closeModal = (e) => {
        props.onModalHide(false);
    }

    const handleSaveChanges = (e) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("id", order._id);
        urlencoded.append("country", order.country);
        urlencoded.append("qty", order.qty);
        urlencoded.append("customerName", document.getElementById('form-order-customer').value);
        urlencoded.append("city", document.getElementById('form-order-city').value);
        urlencoded.append("province", document.getElementById('form-order-prov').value);
        urlencoded.append("phone", document.getElementById('form-order-phone').value);
        urlencoded.append("email", document.getElementById('form-order-email').value);
        urlencoded.append("address1", document.getElementById('form-order-address1').value);
        urlencoded.append("address2", document.getElementById('form-order-address2').value);
        urlencoded.append("status", document.getElementById('form-order-status').value);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/order/", requestOptions)
            .then(response => response.text())
            .then(result => {

                alert('Updated successfully!');
                props.onOrderUpdate();
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });
    }

    return (
        <>
            <Modal dialogClassName="modal-90w" show={toggleEdit} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="order-detail" id="order-tab-page">
                        <Tab eventKey="order-detail" title="Order Details">
                            <Form className="form-update-order">
                                <Row className="text-left order-product-details">
                                    <Col>Country:</Col>
                                    <Col className="value">{order.country}</Col>
                                    <Col>Product:</Col>
                                    <Col className="value">{order.productName}</Col>
                                    <Col>Quantity:</Col>
                                    <Col className="value">{order.qty}</Col>
                                    <Col>Payment Type:</Col>
                                    <Col className="value">{order.payType}</Col>
                                </Row>

                                <div className="order-category-title">
                                    <span>Customer Details</span>
                                </div>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="form-order-customer">
                                        <Form.Label>Customer Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter customer's name..." defaultValue={order.customerName} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="form-order-city">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control type="text" placeholder="Enter city..." defaultValue={order.city} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="form-order-prov">
                                        <Form.Label>Province</Form.Label>
                                        <Form.Control type="text" placeholder="Enter province..." defaultValue={order.province} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="form-order-phone">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control type="text" placeholder="Enter phone number..." defaultValue={order.phone} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="form-order-email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter email address..." defaultValue={order.email} />
                                    </Form.Group>

                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="form-order-address1">
                                        <Form.Label>Address 1</Form.Label>
                                        <Form.Control type="text" placeholder="Enter address #1..." defaultValue={order.address1} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="form-order-status">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control as="select" defaultValue={order.status} >
                                            <option value="Approve">Approve</option>
                                            <option value="Reject">Reject</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Invalid">Invalid</option>
                                            <option value="Confirm">Confirm</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="form-order-address2">
                                        <Form.Label>Address 2</Form.Label>
                                        <Form.Control type="text" placeholder="Enter address #2..." defaultValue={order.address2} />
                                    </Form.Group>

                                    <Col>&nbsp;</Col>

                                </Form.Row>

                            </Form>
                        </Tab>
                        <Tab eventKey="agent-notes" title="Notes" className="agent-notes" disabled>
                            <Row className="mt-3">
                                <Col>
                                    <Form.Group controlId="form-order-notes">
                                        <Form.Label>Agent Notes</Form.Label>
                                        <Form.Control as="textarea" placeholder="Provide your notes here..." rows={5} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="order-header text-center">
                                <Col>Full Name</Col>
                                <Col>Date Created</Col>
                                <Col>Note</Col>
                            </Row>
                            <Row className="note-list text-center">
                                <Col>Herbert</Col>
                                <Col>May 1, 2021</Col>
                                <Col>
                                    <Form.Control as="textarea" rows={2} value="No answer during phonecall." readOnly />
                                </Col>
                            </Row>
                            <Row className="note-list text-center">
                                <Col>Herbert</Col>
                                <Col>May 1, 2021</Col>
                                <Col>
                                    <Form.Control as="textarea" rows={2} value="No answer during phonecall." readOnly />
                                </Col>
                            </Row>

                        </Tab>
                    </Tabs>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="primary" className="btn-primary-action" onClick={handleSaveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UpdateOrder;