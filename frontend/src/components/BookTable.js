import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BookTable = ({ books, onDelete }) => {
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getStockBadge = (quantity) => {
    if (quantity === 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    } else if (quantity < 5) {
      return <Badge bg="warning" text="dark">Low Stock</Badge>;
    } else {
      return <Badge bg="success">In Stock</Badge>;
    }
  };

  const getRowClassName = (quantity) => {
    if (quantity === 0) {
      return 'table-danger';
    } else if (quantity < 5) {
      return 'table-warning';
    }
    return '';
  };

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead className="table-dark">
          <tr>
            <th>
              <i className="fas fa-book me-2"></i>
              Title
            </th>
            <th>
              <i className="fas fa-user me-2"></i>
              Author
            </th>
            <th>
              <i className="fas fa-barcode me-2"></i>
              ISBN
            </th>
            <th>
              <i className="fas fa-tags me-2"></i>
              Category
            </th>
            <th>
              <i className="fas fa-dollar-sign me-2"></i>
              Price
            </th>
            <th>
              <i className="fas fa-boxes me-2"></i>
              Quantity
            </th>
            <th>
              <i className="fas fa-info-circle me-2"></i>
              Status
            </th>
            <th width="200">
              <i className="fas fa-cogs me-2"></i>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} className={getRowClassName(book.quantity)}>
              <td>
                <strong>{book.title}</strong>
              </td>
              <td>{book.author}</td>
              <td>
                <code className="text-muted">{book.isbn}</code>
              </td>
              <td>
                <Badge bg="secondary">{book.category}</Badge>
              </td>
              <td>
                <strong className="text-success">
                  {formatPrice(book.price)}
                </strong>
              </td>
              <td>
                <span className={book.quantity < 5 ? 'text-danger fw-bold' : ''}>
                  {book.quantity}
                </span>
              </td>
              <td>
                {getStockBadge(book.quantity)}
              </td>
              <td>
                <div className="btn-group" role="group">
                  <Button
                    as={Link}
                    to={`/books/edit/${book._id}`}
                    variant="outline-primary"
                    size="sm"
                    title="Edit Book"
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(book._id)}
                    title="Delete Book"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {books.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No books found</h5>
        </div>
      )}
    </div>
  );
};

export default BookTable;