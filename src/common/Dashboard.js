import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Chart from 'react-google-charts';
import Spinner from 'react-bootstrap/Spinner';

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmCount: 0,
            pendingCount: 0,
            rejectCount: 0,
            approveCount: 0,
            invalidCount: 0
        };
    }

    componentDidMount() {
        sessionStorage.setItem('current-page', 'Dashboard');

        this.fetchCount();
    }

    fetchCount() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/order-count/1/Confirm", requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);
                this.setState({ confirmCount: data.count });
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/order-count/1/Pending", requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);
                this.setState({ pendingCount: data.count });
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/order-count/1/Approve", requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);
                this.setState({ approveCount: data.count });
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/order-count/1/Reject", requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);
                this.setState({ rejectCount: data.count });
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });

        fetch("http://ec2-3-133-147-27.us-east-2.compute.amazonaws.com:4000/org/order-count/1/Invalid", requestOptions)
            .then(response => response.text())
            .then(result => {
                let data = JSON.parse(result);
                this.setState({ invalidCount: data.count });
            })
            .catch(error => {
                alert('An error occured. Please contact administrator for support.');
                console.log('error', error);
            });
    }

    render() {

        return (
            <>
                <Row className="app-dashboard">
                    <Col className="text-center">
                        <Chart
                            width={'100%'}
                            height={'500px'}
                            chartType="PieChart"
                            loader={<div><Spinner animation="border" variant="primary" /></div>}
                            data={
                                [
                                    ["Status", "Count"],
                                    ["Confirm", this.state.confirmCount],
                                    ["Pending", this.state.pendingCount],
                                    ["Reject", this.state.rejectCount],
                                    ["Approve", this.state.approveCount],
                                    ["Invalid", this.state.invalidCount]
                                ]
                            }
                            options={{
                                title: 'Product Orders',
                                is3D: true,
                                pieSliceText: 'value',
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />

                    </Col>
                </Row>

            </>

        );
    }
}