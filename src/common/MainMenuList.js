import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class MainMenuList extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (e) {
        console.log("menu-click");
        console.log(e.target.innerHTML);
        
        sessionStorage.setItem('current-page', e.target.innerHTML);
    }

    render() {

        return (
            <>
                <Row className="menu">
                    <Col>
                        <div className={this.props.title === 'Dashboard' ? "menu-title dashboard-menu" : "menu-title"}>
                            {this.props.title === 'Dashboard' ?
                                <a href="/" onClick={this.handleClick}>Dashboard</a>
                                :
                                this.props.title
                        }</div>
                        <div className="sub-menu">
                            <ul>
                                {this.props.menuList.map((item) => {
                                    return <li key={item.title}><a href={item.path} onClick={this.handleClick}>{item.title}</a></li>
                                })
                                }
                            </ul>
                        </div>
                    </Col>
                </Row>
            </>
        );
    };
}

