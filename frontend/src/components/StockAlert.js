import React, { useState, useEffect } from 'react';
import { Alert, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StockAlert = () => {
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchLowStockBooks();
  }, []);

  const fetchLowStockBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Filter books with quantity < 5
        const lowStock = data.data.filter(book => book.quantity < 5);
        setLowStockBooks(lowStock);
      } else {
        setError(data.message || 'Failed to fetch books');
      }
    } catch (error) {
      console.error('Fetch low stock books error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Alert variant="warning">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Checking stock levels...
        </div>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <i className="fas fa-exclamation-circle me-2"></i>
        {error}
      </Alert>
    );
  }

  if (lowStockBooks.length === 0) {
    return (
      <Alert variant="success">
        <div className="d-flex align-items-center">
          <i className="fas fa-check-circle me-3 fa-lg"></i>
          <div>
            <strong>All Good!</strong> All books are well stocked.
          </div>
        </div>
      </Alert>
    );
  }

  const displayBooks = showAll ? lowStockBooks : lowStockBooks.slice(0, 5);
  const hasMore = lowStockBooks.length > 5;

  return (
    <Alert variant="warning" className="border-0 shadow-sm">
      <div className="d-flex align-items-start">
        <i className="fas fa-exclamation-triangle me-3 fa-lg mt-1"></i>
        <div className="flex-grow-1">
          <Alert.Heading className="h5 mb-3">
            Low Stock Alert ({lowStockBooks.length} books)
          </Alert.Heading>
          
          <p className="mb-3">
            The following books are running low on stock (less than 5 copies):
          </p>

          <ListGroup variant="flush" className="mb-3">
            {displayBooks.map((book) => (
              <ListGroup.Item 
                key={book._id} 
                className="d-flex justify-content-between align-items-center px-0 border-0"
              >
                <div>
                  <strong>{book.title}</strong> by {book.author}
                  <br />
                  <small className="text-muted">
                    ISBN: {book.isbn} | Category: {book.category}
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <span className={`badge me-3 ${book.quantity === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {book.quantity === 0 ? 'Out of Stock' : `${book.quantity} left`}
                  </span>
                  <Button
                    as={Link}
                    to={`/books/edit/${book._id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    <i className="fas fa-edit me-1"></i>
                    Restock
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              {hasMore && (
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setShowAll(!showAll)}
                >
                  <i className={`fas fa-chevron-${showAll ? 'up' : 'down'} me-2`}></i>
                  {showAll ? 'Show Less' : `Show ${lowStockBooks.length - 5} More`}
                </Button>
              )}
            </div>
            
            <div>
              <Button 
                as={Link} 
                to="/books" 
                variant="outline-warning"
                size="sm"
                className="me-2"
              >
                <i className="fas fa-list me-2"></i>
                View All Books
              </Button>
              
              <Button 
                as={Link} 
                to="/books/add" 
                variant="warning"
                size="sm"
              >
                <i className="fas fa-plus me-2"></i>
                Add New Book
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default StockAlert;