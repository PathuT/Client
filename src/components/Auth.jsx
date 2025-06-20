import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Please enter both username and password');
      return;
    }
    alert(`${isSignup ? 'Signed up' : 'Logged in'} as ${username}`);
    navigate('/Submission');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f2f4f8',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2.5rem 3rem',
        borderRadius: '10px',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)',
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#333' }}>
          {isSignup ? 'Sign Up for Agentic AI' : 'Login to Agentic AI'}
        </h2>

        <label htmlFor="username" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '1.2rem',
            fontSize: '1rem'
          }}
        />

        <label htmlFor="password" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '1.5rem',
            fontSize: '1rem'
          }}
        />

        <button type="submit" style={{
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '0.8rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}>
          {isSignup ? 'Sign Up' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.95rem' }}>
          {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <button type="button" onClick={toggleMode} style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}>
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Auth;
