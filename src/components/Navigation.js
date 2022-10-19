import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';

export default class Navigation extends React.Component {

    render() {
        return (
            <Navbar bg="light" variant="light" sticky='top'>
                <Container>
                    <Navbar.Brand href="/">Wanda Collection's</Navbar.Brand>
                    <Nav className="me-auto">
                    <Nav.Link href="/statistic">Statistic</Nav.Link>
                    <Nav.Link href="/admin">Admin</Nav.Link>
                    <Nav.Link href="/stock">Live Stock</Nav.Link>
                    <Nav.Link href="/transaction">Transaction</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}