import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookTable from '../components/BookTable';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm, categoryFilter]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/books', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setBooks(data.data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.data.map(book => book.category))];
        setCategories(uniqueCategories);
      } else {
        setError(data.message || 'Failed to fetch books');
      }
    } catch (error) {
      console.error('Fetch books error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower) ||
        book.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(book => book.category === categoryFilter);
    }

    setFilteredBooks(filtered);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Remove book from state
        setBooks(books.filter(book => book._id !== bookId));
        setError('');
      } else {
        setError(data.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Delete book error:', error);
      setError('Network error. Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4 text-primary">
                <i className="fas fa-books me-3"></i>
                All Books
              </h1>
              <p className="lead text-muted">
                Manage your book inventory ({filteredBooks.length} of {books.length} books)
              </p>
            </div>
            <Button as={Link} to="/books/add" variant="primary" size="lg">
              <i className="fas fa-plus me-2"></i>
              Add New Book
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Search and Filter Controls */}
      <Row className="mb-4">
        <Col>
          <div className="bg-white p-4 rounded shadow-sm border">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <i className="fas fa-search me-2"></i>
                    Search Books
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search by title, author, ISBN, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                    )}
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    <i className="fas fa-filter me-2"></i>
                    Filter by Category
                  </Form.Label>
                  <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={clearFilters}
                  className="w-100"
                  disabled={searchTerm === '' && categoryFilter === 'all'}
                >
                  <i className="fas fa-eraser me-2"></i>
                  Clear
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Books Table */}
      <Row>
        <Col>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">
                {books.length === 0 ? 'No books found' : 'No books match your search criteria'}
              </h4>
              <p className="text-muted">
                {books.length === 0 ? (
                  <>Start by adding your first book to the inventory.</>
                ) : (
                  <>Try adjusting your search terms or filters.</>
                )}
              </p>
              {books.length === 0 && (
                <Button as={Link} to="/books/add" variant="primary" size="lg">
                  <i className="fas fa-plus me-2"></i>
                  Add Your First Book
                </Button>
              )}
            </div>
          ) : (
            <BookTable books={filteredBooks} onDelete={handleDelete} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AllBooks;