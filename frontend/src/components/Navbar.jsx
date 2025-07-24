import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'
      } shadow-sm`}
      style={{ fontFamily: "'Poppins', sans-serif", position: 'sticky', top: 0, zIndex: 1000 }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{ color: theme === 'dark' ? '#f48fb1' : '#880e4f' }}
        >
          Smart To-Do{' '}
          <span style={{ marginLeft: 6, color: '#f06292' }} role="img" aria-label="sparkle">
            ✨
          </span>
        </Link>

        <div className="d-flex align-items-center ms-auto gap-2">
          {/* Theme toggle button - always visible */}
          <button
            onClick={toggleTheme}
            className={`btn btn-pink-outline`}
            style={{
              borderRadius: '30px',
              fontWeight: '700',
              padding: '6px 20px',
              boxShadow: theme === 'dark' ? '0 0 15px #f48fb1' : '0 0 10px #f50057',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            aria-label="Toggle theme"
            title="Toggle Dark/Light Theme"
          >
            {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}{' '}
            <span
              style={{
                marginLeft: 8,
                color: '#f06292',
                animation: 'sparkle 1.5s infinite ease-in-out',
                userSelect: 'none',
              }}
            >
              ✨
            </span>
          </button>

          {/* Conditional buttons login/logout */}
          {user ? (
            <button
              onClick={logout}
              className="btn btn-pink"
              style={{
                borderRadius: '30px',
                fontWeight: '700',
                padding: '6px 20px',
                boxShadow: '0 0 15px #f50057',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-pink-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-pink">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
