import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const divaFont = "'Poppins', sans-serif";

const sparkleAnimation = `
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(1) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
  }
`;

const sparkleStyle = {
  display: 'inline-block',
  marginLeft: 6,
  color: 'hotpink',
  animation: 'sparkle 1.5s infinite ease-in-out',
};

const Register = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <>
      <style>{sparkleAnimation}</style>
      <Navbar />
      <div
        className="container mt-4 d-flex flex-column align-items-center"
        style={{
          fontFamily: divaFont,
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #f8bbd0, #e1bee7)',
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(255, 105, 180, 0.5)',
          padding: '2rem',
          maxWidth: '480px',
        }}
      >
        <h1
          className="mb-4 text-center fw-bold"
          style={{
            color: '#880e4f',
            textShadow: '1px 1px 4px #e040fb, 0 0 15px #f48fb1',
            fontSize: '3rem',
            userSelect: 'none',
          }}
        >
          Create Account{' '}
          <span style={sparkleStyle} role="img" aria-label="sparkle">
            🌸
          </span>
          <span style={sparkleStyle} role="img" aria-label="sparkle">
            ✨
          </span>
        </h1>
        <RegisterForm />
        <p
          className="mt-3 text-muted"
          style={{ fontWeight: 600, fontSize: '1.1rem' }}
        >
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-semibold">
            Login here
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
