const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

const API_CONFIG = {
  baseURL: 'https://hga09pj16jk.sn.mynetname.net',
  timeout: 5000, 
  httpsAgent: new https.Agent({
    rejectUnauthorized: false 
  })
};

function isHtmlResponse(response) {
  const contentType = response.headers['content-type'];
  return contentType && contentType.toLowerCase().includes('text/html');
}

const router = express.Router();

router.get('/', async (req, res) => {
  let username = req.query.Usuario;
  let password = req.query.Contraseña;

  if (!username || !password) {
    username = req.body.username;
    password = req.body.password;
  }

  if (!username || !password) {
    return res.status(400).json({
      message: 'Se requieren Usuario y Contraseña como parámetros de URL o en el body'
    });
  }

  try {
    const response = await axios.get(`${API_CONFIG.baseURL}/rest/ppp/secret`, {
      auth: {
        username,
        password
      },
      headers: {
        'Accept': 'application/json'
      },
      timeout: API_CONFIG.timeout,
      httpsAgent: API_CONFIG.httpsAgent,
      validateStatus: false
    });
    if (isHtmlResponse(response)) {
      return res.status(401).json({
        message: 'Autenticación fallida - Se recibió página de login',
        error: 'Credenciales inválidas o sesión expirada'
      });
    }
    console.log('Respuesta del servidor:', JSON.stringify(response.data, null, 2));

    if (!response.data) {
      return res.status(404).json({ message: 'No se encontraron datos del usuario' });
    }

    if (response.status >= 300) {
      return res.status(response.status).json({
        message: 'Error en la respuesta del servidor',
        error: response.data
      });
    }

    res.json(response.data);
  } catch (err) {
    console.error('Error al obtener datos del usuario:', err.message);
    
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({
        message: 'Tiempo de espera agotado',
        error: 'El servidor tardó demasiado en responder'
      });
    }
    
    if (err.response) {
      if (isHtmlResponse(err.response)) {
        return res.status(401).json({
          message: 'Autenticación fallida - Se recibió página de login',
          error: 'Credenciales inválidas o sesión expirada'
        });
      }
      
      return res.status(err.response.status).json({
        message: 'Error al obtener datos del usuario',
        error: err.response.data
      });
    }
    
    res.status(500).json({
      message: 'Error interno del servidor',
      error: err.message
    });
  }
});

router.get('/user', async (req, res) => {
  let username = req.query.Usuario;
  let password = req.query.Contraseña;

  if (!username || !password) {
    username = req.body.username;
    password = req.body.password;
  }

  if (!username || !password) {
    return res.status(400).json({
      message: 'Se requieren Usuario y Contraseña como parámetros de URL o en el body'
    });
  }

  try {
    const response = await axios.get(`${API_CONFIG.baseURL}/rest/user`, {
      auth: {
        username,
        password
      },
      headers: {
        'Accept': 'application/json'
      },
      httpsAgent: API_CONFIG.httpsAgent 
    });

    console.log('Respuesta del servidor /user:', JSON.stringify(response.data, null, 2));

    if (!response.data) {
      return res.status(404).json({ message: 'No se encontraron datos del usuario' });
    }

    res.json(response.data);
  } catch (err) {
    console.error('Error al obtener datos del usuario:', err.message);
    
    if (err.response) {
      return res.status(err.response.status).json({
        message: 'Error al obtener datos del usuario',
        error: err.response.data
      });
    }
    
    res.status(500).json({
      message: 'Error interno del servidor',
      error: err.message
    });
  }
});

router.put('/ppp/secret', async (req, res) => {
  let username = req.query.Usuario;
  let password = req.query.Contraseña;

  if (!username || !password) {
    username = req.body.username;
    password = req.body.password;
  }

  if (!username || !password) {
    return res.status(400).json({
      message: 'Se requieren Usuario y Contraseña para autenticación'
    });
  }

  const secretData = {
    name: req.body.name,
    password: req.body.password,
    service: "pppoe",
    profile: "Home-120Mbps",
    "remote-address": "192.168.121.15",
    comment: req.body.comment
  };

  try {
    const response = await axios.put(
      `${API_CONFIG.baseURL}/rest/ppp/secret`, 
      secretData,
      {
        auth: {
          username,
          password
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        httpsAgent: API_CONFIG.httpsAgent
      }
    );

    console.log('PPP Secret creado:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (err) {
    console.error('Error al crear PPP Secret:', err.message);
    
    if (err.response) {
      return res.status(err.response.status).json({
        message: 'Error al crear PPP Secret',
        error: err.response.data
      });
    }
    
    res.status(500).json({
      message: 'Error interno del servidor',
      error: err.message
    });
  }
});

app.use('/api', router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
