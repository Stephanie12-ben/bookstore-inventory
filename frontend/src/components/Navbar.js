import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout???')) {
      onLogout();
    }
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="shadow">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/dashboard" className="fw-bold">
          <i className="fas fa-book-reader me-2"></i>
          Bookstore Inventory
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active fw-bold' : ''}
            >
              <i className="fas fa-tachometer-alt me-2"></i>
              Dashboard
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/books" 
              className={isActive('/books') ? 'active fw-bold' : ''}
            >
              <i className="fas fa-books me-2"></i>
              All Books
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/books/add" 
              className={isActive('/books/add') ? 'active fw-bold' : ''}
            >
              <i className="fas fa-plus me-2"></i>
              Add Book
            </Nav.Link>
          </Nav>

          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="outline-light" 
                id="user-dropdown"
                className="border-0"
              >
                <i className="fas fa-user-circle me-2"></i>
                Admin
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.ItemText>
                  <div className="text-muted">
                    <small>
                      <i className="fas fa-envelope me-2"></i>
                      admin@bookstore.com
                    </small>
                  </div>
                </Dropdown.ItemText>
                
                <Dropdown.Divider />
                
                <Dropdown.Item 
                  as={Link} 
                  to="/dashboard"
                >
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Dashboard
                </Dropdown.Item>
                
                <Dropdown.Item 
                  as={Link} 
                  to="/books"
                >
                  <i className="fas fa-books me-2"></i>
                  Manage Books
                </Dropdown.Item>
                
                <Dropdown.Divider />
                
                <Dropdown.Item 
                  onClick={handleLogout}
                  className="text-danger"
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;