import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleRegister } = useContext(AuthContext);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await handleRegister({ username, email, password });
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-100 bg-white rounded shadow p-4"
      style={{
        maxWidth: '400px',
        borderRadius: 20,
        boxShadow: '0 0 15px rgba(245, 0, 87, 0.5)',
        fontWeight: 600,
      }}
    >
      <h2
        className="mb-4 text-center"
        style={{ color: '#f50057', fontFamily: "'Poppins', sans-serif" }}
      >
        
      </h2>
      {error && (
        <div
          className="alert alert-danger"
          style={{
            borderRadius: 15,
            boxShadow: '0 0 10px #f50057',
            fontWeight: '700',
          }}
        >
          {error}
        </div>
      )}
      <div className="mb-3">
        <label
          htmlFor="registerUsername"
          className="form-label"
          style={{ fontWeight: '700', color: '#880e4f' }}
        >
          Username
        </label>
        <input
          id="registerUsername"
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Choose a username"
          style={{
            borderRadius: 30,
            border: '2px solid #f06292',
            boxShadow: '0 0 8px #f48fb1 inset',
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="registerEmail"
          className="form-label"
          style={{ fontWeight: '700', color: '#880e4f' }}
        >
          Email address
        </label>
        <input
          id="registerEmail"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your.email@example.com"
          style={{
            borderRadius: 30,
            border: '2px solid #f06292',
            boxShadow: '0 0 8px #f48fb1 inset',
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="registerPassword"
          className="form-label"
          style={{ fontWeight: '700', color: '#880e4f' }}
        >
          Password
        </label>
        <input
          id="registerPassword"
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter password"
          style={{
            borderRadius: 30,
            border: '2px solid #f06292',
            boxShadow: '0 0 8px #f48fb1 inset',
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        />
      </div>
      <button
        type="submit"
        className="btn btn-pink fw-bold w-100"
        style={{
          background: 'linear-gradient(45deg, #f50057, #c51162)',
          borderRadius: 30,
          padding: '12px 0',
          fontSize: '1.2rem',
          boxShadow: '0 0 15px #f50057',
          transition: 'transform 0.2s ease-in-out',
          letterSpacing: '1.2px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
