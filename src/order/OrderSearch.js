import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { DateRange } from 'react-date-range';
import { ReplyFill, Search } from 'react-bootstrap-icons';

function DisplayDateRange({setRangeSearch}) {
    const [pickState, setPickState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);

    const handleDatePick = (e) => {
        setPickState([e.selection]);

        setRangeSearch(e.selection.startDate.toLocaleDateString("en-US"), e.selection.endDate.toLocaleDateString("en-US"), 
                        e.selection.startDate.getTime(), e.selection.endDate.getTime());
    }

    return (
        <DateRange
            editableDateInputs={true}
            onChange={handleDatePick}
            moveRangeOnFirstSelection={false}
            ranges={pickState}
            startDatePlaceholder="From"
            endDatePlaceholder="To"
        />
    );
}

function OrderSearch({handleSearchChange, handleExportData}) {
    const [toggleDatePicker, setToggleDatePicker] = useState('');
    
    const [startDate, setStartDate] = useState('###');
    const [endDate, setEndDate] = useState('###');
    const [startInMS, setStartInMS] = useState(0);
    const [endInMS, setEndInMS] = useState(0);

    const handleChangeDateRange = (start, end, startMS, endMS) => {
        setStartDate(start);
        setEndDate(end);

        setStartInMS(startMS);
        setEndInMS(endMS);
    }

    const handleSelectDate = (e) => {
        setToggleDatePicker(!toggleDatePicker);
    }


    return (
        <>
            <input type="text" id="date-start-in-ms" className="hidden-input" value={startInMS} />
            <input type="text" id="date-end-in-ms" className="hidden-input" value={endInMS} />
            <Row className="search-form text-center">
                <Col md={3} className="text-left">
                    <input id="search-text" type="text" placeholder="Search by any order parameter..." className="form-control" />
                </Col>
                <Col md={3} className="text-left">
                    <Button className="search-date-range" onClick={handleSelectDate}>Select Date</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{'FROM:' + startDate}&nbsp;&nbsp;&nbsp;{'TO:' + endDate + ''}</span>
                    <div className={toggleDatePicker ? "search-date-picker show-element text-center" : "search-date-picker hide-element text-center"}>
                        <DisplayDateRange setRangeSearch={handleChangeDateRange} />
                        <br />
                        <Button variant="dark" onClick={handleSelectDate}>Close</Button>
                    </div>
                </Col>
                <Col md={2}>
                    <select id="search-status" className="form-control">
                        <option value="Any Status">Any Status</option>
                        <option value="Approve">Approve</option>
                        <option value="Reject">Reject</option>
                        <option value="Pending">Pending</option>
                        <option value="Invalid">Invalid</option>
                        <option value="Confirm">Confirm</option>
                    </select>
                </Col>
                <Col md={2}>
                    <select id="search-product" className="form-control">
                        <option value="All Products">All Products</option>
                        <option value="Vipromac">Vipromac</option>
                    </select>
                </Col>
                <Col md={2}>
                    <Button variant="primary" onClick={handleSearchChange}><Search size={14}/>&nbsp;SEARCH</Button>{' '}
                    <Button variant="dark" onClick={handleExportData} className="btn-export"><ReplyFill size={14} />&nbsp;EXPORT</Button>
                </Col>
            </Row>

        </>

    );

}

export default OrderSearch;