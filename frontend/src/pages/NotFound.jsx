import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container text-center mt-5">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);

export default NotFound;
