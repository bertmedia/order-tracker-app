import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class Footer extends React.Component {

    render() {
        return (
            <Row className="footer">
                <Col>
                <hr />
                    &copy;2021. All Rights Reserved.
                    </Col>
            </Row>
        );
    }
}