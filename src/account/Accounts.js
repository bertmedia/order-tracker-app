
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Plus } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';

function Accounts({ orgId }) {
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [data, setData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if(!dataLoaded) {
            fetchData();
            setDataLoaded(true);
        }
    }, [dataLoaded]);

    const handleSaveUser = (e) => {
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            console.log("form error");
            e.preventDefault();
            e.stopPropagation();

        } else {
            console.log("form OK");

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("userid", document.getElementById("form-userid").value);
            urlencoded.append("firstname", document.getElementById("form-firstname").value);
            urlencoded.append("lastname", document.getElementById("form-lastname").value);
            urlencoded.append("password", document.getElementById("form-pd").value);
            urlencoded.append("createdAt", Date.now());
            urlencoded.append("updatedAt", Date.now());
            urlencoded.append("orgId", orgId);

            console.log(urlencoded);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/user", requestOptions)
                .then(response => response.text())
                .then(result => {
                    alert("Successfully added user!");
                    console.log(result)
                    //fetchData();
                })
                .catch(error => {
                    alert("Please contact administrator.");
                    console.log(error);
                });
        }

        setValidated(true);
    }

    function fetchData() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/users/" + orgId, requestOptions)
            .then(response => response.text())
            .then(result => {
                setData(JSON.parse(result));
            })
            .catch(error => {
                console.log('error', error);
                setData([]);
            });

    }

    const handleOpenModal = (e) => {
        if (e.target.dataset.key === 'add') {
            setModalTitle('Add User');
        } else {
            setModalTitle('Edit User');
        }

        setValidated(false);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <Modal dialogClassName="modal-50w"
                show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="form-product" noValidate validated={validated} onSubmit={handleSaveUser}>
                        <Form.Control type="text" id="form-product-id" hidden />
                        <Form.Control type="text" id="form-org-id" hidden />

                        <Form.Row>
                            <Form.Group as={Col} controlId="form-firstname">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" required />
                            </Form.Group>

                            <Form.Group as={Col} controlId="form-lastname">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" required />
                            </Form.Group>
                        </Form.Row>
                        {orgId === 'sys' ?
                            (
                                <>
                                    <Form.Group as={Col} controlId="form-is-org-owner">
                                        <Form.Check type="checkbox" label="Application Admin?" />
                                    </Form.Group>
                                </>
                            )
                            :
                            ('')

                        }

                        <Form.Row>
                            <Form.Group as={Col} controlId="form-userid">
                                <Form.Label>User ID</Form.Label>
                                <Form.Control type="text" required />
                            </Form.Group>

                            <Form.Group as={Col} controlId="form-pd">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" required />
                            </Form.Group>
                        </Form.Row>

                        <Row className="text-right">
                            <Col>
                                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>{' '}
                                <Button variant="primary" type="submit" className="btn-primary-action" >Save Changes</Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Row className="mt-3">
                <Col><Button className="product-add-action" variant="primary" zdata-key="add" onClick={handleOpenModal}><Plus size={22} />Add</Button></Col>
            </Row>
            <Table striped bordered hover className="tbl-result">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date Created</th>
                        <th>Date Updated</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ?
                        data.map((item, index) => {
                            return (
                                <>
                                    <tr key={item._id}>
                                        <td>{item.userid}</td>
                                        <td>{item.firstname}</td>
                                        <td>{item.lastname}</td>
                                        <td>{new Date(+item.createdAt).toDateString()}</td>
                                        <td>{new Date(+item.updatedAt).toDateString()}</td>
                                        <td>
                                            <Button variant="outline-dark" id="edit-prod" data-key={item._id} onClick={handleOpenModal}>Edit</Button>{' '}
                                            <Button variant="danger" data-key={item._id} id="del-prod">Delete</Button>
                                        </td>
                                    </tr>
                                </>
                            );
                        })
                        :
                        (
                            <tr className="text-center">
                                <td colSpan="6">There are no users found.</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>

        </>
    );
}

export default Accounts;
