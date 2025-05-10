# TEST_PLUS

Repositorio de pruebas para desarrollo y consumo de APIs RESTful, ideal para experimentación con diferentes flujos de autenticación, validación y testing de endpoints. Este proyecto sirve como entorno de laboratorio para desarrollo backend y frontend acoplado.

## 🎯 Objetivos

- Construir endpoints RESTful robustos y seguros.
- Simular flujos de login, CRUD y consumo de datos externos.
- Probar middlewares personalizados y herramientas de testeo.
- Servir como plantilla base para nuevos proyectos de APIs.

## 🛠️ Tecnologías utilizadas

### Backend
- **Node.js** – Entorno de ejecución
- **Express.js** – Framework para construir APIs
- **JWT** – Autenticación con tokens
- **bcrypt** – Encriptación de contraseñas
- **CORS** – Seguridad de origen cruzado

### Frontend
- **React.js** – Interfaz de usuario
- **Vite** – Empaquetador rápido
- **Axios** – Cliente HTTP
- **Tailwind CSS** – Framework de estilos

## 🚀 Instalación

### Backend

```bash
cd TEST-APIS/backend
npm install
npm run dev
```

### Frontend

```bash
cd TEST-APIS/frontend
npm install
npm run dev
```

## 📂 Estructura del proyecto

```
TEST_PLUS/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   └── app.js
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   └── src/App.jsx
└── README.md
```

## 🔐 Seguridad

- Autenticación basada en JWT
- Validación de inputs
- CORS configurado por entorno
