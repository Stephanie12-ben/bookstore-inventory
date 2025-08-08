import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StockAlert from '../components/StockAlert';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    lowStockBooks: 0,
    highestPrice: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 text-primary">
            <i className="fas fa-tachometer-alt me-3"></i>
            Dashboard
          </h1>
          <p className="lead text-muted">Welcome to your bookstore inventory overview</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title opacity-75">Total Books</h5>
                <h2 className="mb-0">{stats.totalBooks}</h2>
              </div>
              <div className="ms-3">
                <i className="fas fa-book fa-2x opacity-75"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className={`h-100 border-0 shadow-sm ${stats.lowStockBooks > 0 ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title opacity-75">Low Stock</h5>
                <h2 className="mb-0">{stats.lowStockBooks}</h2>
                <small className="opacity-75">books (quantity &lt; 5)</small>
              </div>
              <div className="ms-3">
                <i className={`fas fa-exclamation-triangle fa-2x opacity-75`}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm bg-info text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title opacity-75">Highest Price</h5>
                <h2 className="mb-0">${stats.highestPrice.toFixed(2)}</h2>
              </div>
              <div className="ms-3">
                <i className="fas fa-dollar-sign fa-2x opacity-75"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm bg-secondary text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title opacity-75">Categories</h5>
                <h2 className="mb-0">{stats.totalCategories}</h2>
              </div>
              <div className="ms-3">
                <i className="fas fa-tags fa-2x opacity-75"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      {stats.lowStockBooks > 0 && (
        <Row className="mb-4">
          <Col>
            <StockAlert />
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2 text-warning"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} lg={3} className="mb-3">
                  <div className="d-grid">
                    <Button 
                      as={Link} 
                      to="/books/add" 
                      variant="outline-primary" 
                      size="lg"
                      className="h-100"
                    >
                      <i className="fas fa-plus-circle fa-2x d-block mb-2"></i>
                      Add New Book
                    </Button>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-3">
                  <div className="d-grid">
                    <Button 
                      as={Link} 
                      to="/books" 
                      variant="outline-success" 
                      size="lg"
                      className="h-100"
                    >
                      <i className="fas fa-list fa-2x d-block mb-2"></i>
                      View All Books
                    </Button>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-3">
                  <div className="d-grid">
                    <Button 
                      as={Link} 
                      to="/books?filter=lowstock" 
                      variant="outline-warning" 
                      size="lg"
                      className="h-100"
                    >
                      <i className="fas fa-exclamation-triangle fa-2x d-block mb-2"></i>
                      Low Stock Items
                    </Button>
                  </div>
                </Col>
                
                <Col md={6} lg={3} className="mb-3">
                  <div className="d-grid">
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline-info" 
                      size="lg"
                      className="h-100"
                    >
                      <i className="fas fa-sync-alt fa-2x d-block mb-2"></i>
                      Refresh Data
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;