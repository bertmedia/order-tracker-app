import React from 'react';
import ReactDOM from 'react-dom';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/custom.css';
import Landing  from './common/Landing';

import Container from 'react-bootstrap/Container';

class MainApp extends React.Component {
    render() {
        return(
            <Container fluid>
                <Landing />
            </Container>
        );
    };
}

// ========================================

ReactDOM.render(
    <MainApp />,
    document.getElementById('root')
);
