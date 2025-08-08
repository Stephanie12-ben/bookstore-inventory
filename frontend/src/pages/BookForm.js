import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingBook, setFetchingBook] = useState(isEditing);

  const commonCategories = [
    'Fiction',
    'Non-Fiction', 
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Technology',
    'Children',
    'Young Adult',
    'Poetry',
    'Drama'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchBook();
    }
  }, [id, isEditing]);

  const fetchBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/books/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const book = data.data;
        setFormData({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          price: book.price.toString(),
          quantity: book.quantity.toString(),
          category: book.category
        });
      } else {
        setError(data.message || 'Failed to fetch book details');
      }
    } catch (error) {
      console.error('Fetch book error:', error);
      setError('Network error. Please try again.');
    } finally {
      setFetchingBook(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    const { title, author, isbn, price, quantity, category } = formData;

    if (!title.trim()) return 'Title is required';
    if (!author.trim()) return 'Author is required';
    if (!isbn.trim()) return 'ISBN is required';
    if (!category.trim()) return 'Category is required';
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) return 'Price must be a valid positive number';
    
    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 0) return 'Quantity must be a valid non-negative number';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `/api/books/${id}` : '/api/books';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          navigate('/books');
        }, 1500);
      } else {
        setError(data.message || `Failed to ${isEditing ? 'update' : 'add'} book`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingBook) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading book details...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow border-0">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className={`fas fa-${isEditing ? 'edit' : 'plus'} me-2`}></i>
                  {isEditing ? 'Edit Book' : 'Add New Book'}
                </h4>
                <Button 
                  as={Link} 
                  to="/books" 
                  variant="light" 
                  size="sm"
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Books
                </Button>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-book me-2"></i>
                        Book Title *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter book title"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-user me-2"></i>
                        Author *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Enter author name"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-barcode me-2"></i>
                        ISBN *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        placeholder="Enter ISBN"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-tags me-2"></i>
                        Category *
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {commonCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-dollar-sign me-2"></i>
                        Price *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <i className="fas fa-boxes me-2"></i>
                        Quantity *
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="0"
                        required
                      />
                      <Form.Text className="text-muted">
                        Books with quantity less than 5 will be marked as low stock
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <hr />

                <div className="d-flex justify-content-between">
                  <Button 
                    as={Link} 
                    to="/books" 
                    variant="outline-secondary"
                    disabled={loading}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </Button>

                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </span>
                        {isEditing ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <i className={`fas fa-${isEditing ? 'save' : 'plus'} me-2`}></i>
                        {isEditing ? 'Update Book' : 'Add Book'}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookForm;