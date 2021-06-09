import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Plus } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

export class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleAdd: false,
            modalTitle: 'Add Product',
            formValidation: false,
            productList: [],
            formCode: '',
            formId: '',
            formName: '',
        };

        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleSaveForm = this.handleSaveForm.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {

        this.fetchData();
    }

    fetchData() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/products/1", requestOptions)
            .then(response => response.text())
            .then(result => {
                //console.log(result);
                //console.log('This is fetching....');
                //console.log(result);
                this.setState({ productList: JSON.parse(result) });
            })
            .catch(error => {
                console.log('error', error);
                this.setState({ productList: [] });
            });
    }

    handleCloseModal() {
        this.setState({ formCode: '' });
        this.setState({ formName: '' });
        this.setState({ formId: '' });

        this.setState({ toggleAdd: false });
    }

    handleOpenModal(e) {

        let title = 'Edit Product';
        this.setState({ toggleAdd: true });
        if (e.target.id === 'add-prod') {
            title = 'Add Product';
            this.setState({ formCode: this.makeId() });
        } else {

            this.setState({ formCode: e.target.dataset.code });
            this.setState({ formName: e.target.dataset.name });
            this.setState({ formId: e.target.dataset.key });
        }

        this.setState({ modalTitle: title });
    }

    handleDelete(e) {
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };


        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/product/" + e.target.dataset.key, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                alert('Deleted successfully!');
                this.fetchData();
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });
    }


    handleSaveForm(e) {
        const frm = e.currentTarget;

        if (frm.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            console.log("data key=" + document.getElementById('form-product-id').value);
            let myHeaders = new Headers();
            let urlencoded = new URLSearchParams();
            let apiMethod = 'POST';
            let alertText = "Product created successfully!";
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            if (document.getElementById('form-product-id').value === 'add') {
                urlencoded.append("code", document.getElementById("form-product-code").value);
                urlencoded.append("name", document.getElementById("form-product-name").value);
                urlencoded.append("createdAt", Date.now());
                urlencoded.append("updatedAt", Date.now());
                urlencoded.append("orgId", 1);

            } else {

                urlencoded.append("id", this.state.formId);
                urlencoded.append("name", document.getElementById("form-product-name").value);
                urlencoded.append("updatedAt", Date.now());
                apiMethod = 'PUT';
                alertText = "Product updated successfully!";
            }

            let requestOptions = {
                method: apiMethod,
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/product", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    alert(alertText);

                    this.fetchData();
                    this.setState({ toggleAdd: false });
                })
                .catch(error => {
                    console.log('error', error);
                    alert('An error occured. Please contact administrator for support.');
                });
        }



        this.setState({ formValidation: true });
    }

    makeId = () => {
        let ID = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 12; i++) {
            ID += characters.charAt(Math.floor(Math.random() * 36));
        }
        return ID;
    }


    render() {
        return (
            <>
                <Modal dialogClassName="modal-50w" show={this.state.toggleAdd} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="form-product" noValidate validated={this.state.formValidation}
                            onSubmit={this.handleSaveForm}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="form-product-code">
                                    <Form.Label>Product ID</Form.Label>
                                    <Form.Control type="text" defaultValue={this.state.formCode} readOnly />
                                </Form.Group>
                                <Form.Control type="text" id="form-product-id" defaultValue={this.state.formId} hidden />

                                <Form.Group as={Col} controlId="form-product-name">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control type="text" defaultValue={this.state.formName} required />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a product name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <small>{'* Product ID is used when creating orders. This value is system generated.'}</small>
                            </Form.Row>
                            <Row className="text-right">
                                <Col>
                                    <Button variant="secondary" onClick={this.handleCloseModal}>Close</Button>{' '}
                                    <Button variant="primary" type="submit" className="btn-primary-action">Save Changes</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Row className="mt-3">
                    <Col><Button className="product-add-action" variant="primary" id="add-prod" data-key="add" onClick={this.handleOpenModal}><Plus size={22} />Add</Button></Col>
                </Row>
                <Table striped bordered hover className="tbl-result">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Date Added</th>
                            <th>Date Updated</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.productList.length > 0 ?
                            this.state.productList.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{item.code}</td>
                                            <td>{item.name}</td>
                                            <td>{new Date(+item.createdAt).toDateString()}</td>
                                            <td>{new Date(+item.updatedAt).toDateString()}</td>
                                            <td>
                                                <Button variant="outline-dark" id="edit-prod" data-key={item._id} data-name={item.name} data-code={item.code}
                                                    onClick={this.handleOpenModal}>Edit</Button>{' '}
                                                <Button variant="danger" data-key={item._id} id="del-prod" onClick={this.handleDelete}>Delete</Button>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })
                            :
                            (
                                <tr className="text-center">
                                    <td colSpan="5">There are no products found.</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
            </>
        );
    }

}