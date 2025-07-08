const { useState } = React;

function Register({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      onRegistered();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={register}>
      <h2>Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      onLogin(data.token);
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={login}>
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

function Profile({ token }) {
  const [user, setUser] = useState(null);

  const loadProfile = async () => {
    const res = await fetch('/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  if (!token) return null;

  return (
    <div>
      <button onClick={loadProfile}>Load Profile</button>
      {user && <p>Logged in as {user}</p>}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token && (
        <>
          <Register onRegistered={() => alert('Registered!')} />
          <Login onLogin={setToken} />
        </>
      )}
      {token && <Profile token={token} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
