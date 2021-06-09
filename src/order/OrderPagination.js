import { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';


function OrderPagination({ data, pageLimit, dataLimit }) {
    const [pages, setPages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    function goToNextPage() {
        setCurrentPage((page) => page + 1);
    }

    function goToPreviousPage() {
        setCurrentPage((page) => page - 1);
    }

    function changePage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }

    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <>
            <Row className="search-result-info align-middle">
                <Col md={3}>Showing 11 - 20 of 64 results</Col>
                <Col md={6}>
                    <Pagination size="sm" className="justify-content-center">
                        <Pagination.First />
                        <Pagination.Prev />
                        {getPaginationGroup().map((item, idx) =>{
                            return(
                                <Pagination.Item key={idx} active={currentPage == item ? true : false}>{item}</Pagination.Item>
                            );
                        })
                        }
                        <Pagination.Next />
                        <Pagination.Last />
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
        </>
    );
}

export default OrderPagination;