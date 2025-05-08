import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [pppSecrets, setPppSecrets] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [newSecret, setNewSecret] = useState({
    name: '',
    password: '',
    comment: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Try to fetch user data first to validate credentials
      const userResponse = await axios.get(`${API_URL}/user`, {
        params: {
          Usuario: credentials.username,
          Contraseña: credentials.password
        }
      });
      
      if (userResponse.data) {
        // If user authentication successful, fetch PPP secrets
        await fetchPppSecrets();
        setResponse(userResponse.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      setResponse(null);
      setPppSecrets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewSecretChange = (e) => {
    const { name, value } = e.target;
    setNewSecret(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSecret = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/ppp/secret`, {
        ...newSecret,
        username: credentials.username,
        password: credentials.password
      });
      
      // Refresh PPP secrets list after creating new one
      await fetchPppSecrets();
      setNewSecret({ name: '', password: '', comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const fetchPppSecrets = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          Usuario: credentials.username,
          Contraseña: credentials.password
        }
      });
      
      if (Array.isArray(response.data)) {
        setPppSecrets(response.data);
      } else {
        setPppSecrets([]);
        console.warn('PPP secrets response was not an array:', response.data);
      }
    } catch (err) {
      console.error('Error fetching PPP secrets:', err);
      setPppSecrets([]);
      throw err; // Re-throw to be handled by the caller
    }
  };

  const filteredPppSecrets = pppSecrets.filter(secret => 
    secret.name?.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Autenticación Router MikroTik</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {!response ? (
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={credentials.username}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      ) : (
        <div className="authenticated-content">
          <div className="user-info">
            <h2>Información del Usuario</h2>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>

          <div className="create-secret-form">
            <h2>Crear Nuevo PPP Secret</h2>
            <form onSubmit={handleCreateSecret}>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={newSecret.name}
                onChange={handleNewSecretChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={newSecret.password}
                onChange={handleNewSecretChange}
              />
              <input
                type="text"
                name="comment"
                placeholder="Comentario"
                value={newSecret.comment}
                onChange={handleNewSecretChange}
              />
              <button type="submit">Crear Secret</button>
            </form>
          </div>

          {pppSecrets.length > 0 && (
            <div className="ppp-secrets">
              <h2>PPP Secrets</h2>
              <div className="filter">
                <input
                  type="text"
                  placeholder="Filtrar por nombre"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </div>
              <div className="secrets-list">
                {filteredPppSecrets.map((secret, index) => (
                  <div key={index} className="secret-item">
                    <h3>Secret #{index + 1}</h3>
                    <p><strong>Name:</strong> {secret.name}</p>
                    <p><strong>Service:</strong> {secret.service}</p>
                    <p><strong>Profile:</strong> {secret.profile}</p>
                    <p><strong>Remote Address:</strong> {secret['remote-address']}</p>
                    <p><strong>Comment:</strong> {secret.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={() => {
              setResponse(null);
              setPppSecrets([]);
              setCredentials({ username: '', password: '' });
            }}
            className="logout-button"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default App;