import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import OrderSearch from './OrderSearch';
import UpdateOrder from './UpdateOrder';

import { ArrowDownShort, ArrowUpShort } from 'react-bootstrap-icons';
export class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleEdit: false,
            orderList: [],
            renderList: [],
            orderItem: {},
            approveCount: 0,
            rejectCount: 0,
            allCount: 0,
            pages: [1],
            currentPage: 1,
            dataLimit: 10,
            pageLimit: 5,
            sortField: 'orderDate',
            sortValue: 'up',
            isSearchInProgress: false,
        };

        // This binding is necessary to make `this` work in the callback
        this.handleOpenOrder = this.handleOpenOrder.bind(this);
        this.handleCloseOrder = this.handleCloseOrder.bind(this);
        this.handleOnUpdateOrder = this.handleOnUpdateOrder.bind(this);
        this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
        this.goToNextPage = this.goToNextPage.bind(this);
        this.goToPreviousPage = this.goToPreviousPage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.handleSearchFilterChange = this.handleSearchFilterChange.bind(this);
        this.handleColumnSort = this.handleColumnSort.bind(this);
        this.handleExportSearch = this.handleExportSearch.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        console.log(sessionStorage.getItem('current-page'));
    }

    fetchData() {

        //get search filters
        let searchText = '', searchStatus = '', searchProduct = '', fetchUri = '', searchFrom = '0', searchTo = '0';
        searchText = document.getElementById('search-text').value === '' ? 'none' : document.getElementById('search-text').value;
        searchStatus = document.getElementById('search-status').value;
        searchProduct = document.getElementById('search-product').value;
        searchFrom = document.getElementById('date-start-in-ms').value;
        searchTo = document.getElementById('date-end-in-ms').value;


        fetchUri = "http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/orders/" + this.state.sortField + "/" +
            this.state.sortValue + "/1/" + searchStatus + "/" + searchProduct + "/" + searchText + "/" + searchFrom + "/" + searchTo;

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(fetchUri, requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({ orderList: JSON.parse(result) });
                this.setState({ allCount: JSON.parse(result).length });
                const startIndex = 1 * this.state.dataLimit - this.state.dataLimit;
                const endIndex = startIndex + this.state.dataLimit;

                let newData = this.state.orderList.slice(startIndex, endIndex);

                this.setState({ renderList: newData });

                let maxPages = JSON.parse(result).length / this.state.dataLimit;
                let start = Math.floor((this.state.currentPage - 1) / this.state.pageLimit) * this.state.pageLimit;
                this.setState({ pages: new Array(Math.ceil(maxPages)).fill().map((_, idx) => start + idx + 1) });

                //reset ordering
                this.setState({ sortField: 'Order Date' });
                this.setState({ sortValue: 'up' });
            })
            .catch(error => {
                console.log('error', error);
                alert('An error occured. Please contact administrator for support.');
            });
    }

    fetchDataSort(field, sort) {

        //get search filters
        let searchText = '', searchStatus = '', searchProduct = '', fetchUri = '', searchFrom = '0', searchTo = '0';
        searchText = document.getElementById('search-text').value === '' ? 'none' : document.getElementById('search-text').value;
        searchStatus = document.getElementById('search-status').value;
        searchProduct = document.getElementById('search-product').value;
        searchFrom = document.getElementById('date-start-in-ms').value;
        searchTo = document.getElementById('date-end-in-ms').value;

        fetchUri = "http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/orders/" + field + "/" +
            sort + "/1/" + searchStatus + "/" + searchProduct + "/" + searchText + "/" + searchFrom + "/" + searchTo;

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(fetchUri, requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({ orderList: JSON.parse(result) });
                this.setState({ allCount: JSON.parse(result).length });
                const startIndex = 1 * this.state.dataLimit - this.state.dataLimit;
                const endIndex = startIndex + this.state.dataLimit;

                let newData = this.state.orderList.slice(startIndex, endIndex);

                this.setState({ renderList: newData });

                let maxPages = JSON.parse(result).length / this.state.dataLimit;
                let start = Math.floor((this.state.currentPage - 1) / this.state.pageLimit) * this.state.pageLimit;
                this.setState({ pages: new Array(Math.ceil(maxPages)).fill().map((_, idx) => start + idx + 1) });
                this.setState({ isSearchInProgress: false });
            })
            .catch(error => {
                console.log('error', error);
                alert('An error occured. Please contact administrator for support.');
            });
    }

    handleSearchFilterChange() {
        this.fetchData();
    }

    handleExportSearch() {
        let data = this.state.orderList;
        let columFields = ["Order ID", "Customer Name", "Address 1", "Product Name", "City", "Province", "Quantity", "Price", "Order Date", "Email Address", "Status", "Payment Type", "Phone", "Country", "Address 2"];
        let csvStr = columFields.join(",") + "\n";


        data.forEach(item => {
            csvStr += item.refId + ',' + item.customerName + ',' + item.address1.replace(",", " ") + ',' + item.productName
                + item.city.replace(",", " ") + "," + item.province.replace(",", " ") + "," + item.qty + "," + item.price + "," + (new Date(+item.orderDate).toDateString()) + ","
                + item.email + "," + item.status + "," + item.payType + "," + item.phone + "," + item.country.replace(",", " ") + "," + item.address2.replace(",", " ")
                + "\n";
        })

        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvStr);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'order_search_result.csv';
        hiddenElement.click();
    }

    goToNextPage() {
        this.setState({ currentPage: this.state.currentPage + 1 });

    }

    goToPreviousPage() {
        this.setState({ currentPage: this.state.currentPage - 1 });

    }

    changePage(event) {
        const pageNumber = Number(event.target.textContent);
        this.setState({ currentPage: pageNumber });

        const startIndex = pageNumber * this.state.dataLimit - this.state.dataLimit;
        const endIndex = startIndex + this.state.dataLimit;

        let newData = this.state.orderList.slice(startIndex, endIndex);
        this.setState({ renderList: newData });
    }

    getStartEndValue(whatValue) {
        const startIndex = this.state.currentPage * this.state.dataLimit - this.state.dataLimit;
        const endIndex = startIndex + this.state.dataLimit;

        if (whatValue === 'start') {
            return startIndex + 1;
        }

        return endIndex

    }

    handleOnUpdateOrder(e) {
        this.fetchData();
    }

    handleStatusUpdate(e) {
        const result = this.state.orderList.find(({ _id }) => _id === e.target.dataset.key);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("id", result._id);
        urlencoded.append("country", result.country);
        urlencoded.append("qty", result.qty);
        urlencoded.append("customerName", result.customerName);
        urlencoded.append("city", result.city);
        urlencoded.append("province", result.province);
        urlencoded.append("phone", result.phone);
        urlencoded.append("email", result.email);
        urlencoded.append("address1", result.address1);
        urlencoded.append("address2", result.address2);
        urlencoded.append("status", e.target.dataset.status);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/order/", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                alert('Status changed successfully!');

                this.fetchData();
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });
    }

    handleOpenOrder(e) {

        const result = this.state.orderList.find(({ _id }) => _id === e.target.dataset.key);
        //console.log(result);

        this.setState({ orderItem: result });
        this.setState({ toggleEdit: true });
    }

    handleCloseOrder(bValue) {
        this.setState({ toggleEdit: bValue });
    }

    handleColumnSort(e) {
        this.setState({ isSearchInProgress: true });

        let sortVal = 'up';
        if (e.target.dataset.key === '') {
            e.preventDefault();
            exports.stopPropagation();
        }

        if (this.state.sortField === e.target.dataset.key) {
            if (this.state.sortValue === 'up') {
                sortVal = 'desc';
            } else {
                sortVal = 'up';
            }

            this.setState({ sortValue: sortVal });

        } else {
            this.setState({ sortField: e.target.dataset.key });
            this.setState({ sortValue: sortVal });
        }

        this.fetchDataSort(e.target.dataset.key, sortVal);
    }


    render() {
        return (
            <>
                <OrderSearch handleSearchChange={this.handleSearchFilterChange} handleExportData={this.handleExportSearch} />
                <hr />
                <UpdateOrder showModal={this.state.toggleEdit} onModalHide={this.handleCloseOrder}
                    orderData={this.state.orderItem} onOrderUpdate={this.handleOnUpdateOrder} />
                <Row>
                    <Col>
                        <Nav className="order-top-menu">
                            <Nav.Item>
                                <Nav.Link href="#" className="selected">Orders <Badge variant="primary" className="selected-badge-count">{this.state.allCount}</Badge></Nav.Link>
                            </Nav.Item>
                            <Nav.Item hidden>
                                <Nav.Link hreaf="#">Approved <Badge variant="primary" className="badge-count">{this.state.approveCount}</Badge></Nav.Link>
                            </Nav.Item>
                            <Nav.Item hidden>
                                <Nav.Link href="#">Rejected <Badge variant="primary" className="badge-count">{this.state.rejectCount}</Badge></Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Row className="search-result-info align-middle">
                    <Col md={3}>
                        {'Showing ' + this.getStartEndValue('start') + ' - ' + this.getStartEndValue('end') + ' of ' + this.state.orderList.length + ' results'}
                        {this.state.isSearchInProgress ?
                            <div>
                                <Spinner animation="border" variant="primary" />
                            </div>
                            : ''
                        }

                    </Col>
                    <Col md={6}>
                        <Pagination size="sm" className="justify-content-center">

                            {this.state.pages.map((item, idx) => {
                                return (
                                    <Pagination.Item key={idx} active={this.state.currentPage === item ? true : false} onClick={this.changePage}>{item}</Pagination.Item>
                                );
                            })
                            }

                        </Pagination>
                    </Col>
                    <Col md={3} className="text-right">

                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="8">Results per page:</Form.Label>
                            <Col sm="4">
                                <Form.Control as="select">
                                    <option>10</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>

                <Table striped bordered hover className="tbl-result">
                    <thead>
                        <tr className="text-center">
                            <th onClick={this.handleColumnSort} data-key="Order ID">Order ID
                                {this.state.sortValue === 'up' && this.state.sortField === 'Order ID' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Order ID' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Customer Name">Customer Name
                                {this.state.sortValue === 'up' && this.state.sortField === 'Customer Name' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Customer Name' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Address">Address
                                {this.state.sortValue === 'up' && this.state.sortField === 'Address' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Address' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Product Name">Product Name
                                {this.state.sortValue === 'up' && this.state.sortField === 'Product Name' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Product Name' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="City">City
                                {this.state.sortValue === 'up' && this.state.sortField === 'City' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'City' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Province">Province
                                {this.state.sortValue === 'up' && this.state.sortField === 'Province' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Province' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Quantity">Quantity
                                {this.state.sortValue === 'up' && this.state.sortField === 'Quantity' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Quantity' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Price">Price
                                {this.state.sortValue === 'up' && this.state.sortField === 'Price' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Price' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Order Date">Order Date
                                {this.state.sortValue === 'up' && this.state.sortField === 'Order Date' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Order Date' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Email Address">Email Address
                                {this.state.sortValue === 'up' && this.state.sortField === 'Email Address' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Email Address' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th onClick={this.handleColumnSort} data-key="Status">Status
                                {this.state.sortValue === 'up' && this.state.sortField === 'Status' ? <ArrowUpShort size={14} /> : ''}
                                {this.state.sortValue === 'desc' && this.state.sortField === 'Status' ? <ArrowDownShort size={14} /> : ''}
                            </th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.renderList.length > 0 ?
                            (this.state.renderList.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index} className="text-center">
                                            <td>{item.refId}</td>
                                            <td>{item.customerName}</td>
                                            <td>{item.address1}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.city}</td>
                                            <td>{item.province}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.price}</td>
                                            <td>{new Date(+item.orderDate).toDateString()}</td>
                                            <td>{item.email}</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <Dropdown key={item._id}>
                                                    <Dropdown.Toggle variant="outline-dark" >
                                                        Actions
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item data-key={item._id} onClick={this.handleOpenOrder}>Edit</Dropdown.Item>
                                                        <Dropdown.Item data-key={item._id} data-status="Approve" onClick={this.handleStatusUpdate}>Approve</Dropdown.Item>
                                                        <Dropdown.Item data-key={item._id} data-status="Reject" onClick={this.handleStatusUpdate}>Reject</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    </>
                                );
                            }))
                            :
                            (
                                <tr className="text-center">
                                    <td colSpan="11">There are no orders found.</td>
                                </tr>

                            )
                        }
                    </tbody>
                </Table>
            </>
        );
    }
}