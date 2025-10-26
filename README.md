# VetCore - Frontend

Interfaz de usuario web para el sistema VetCore. Aplicación React SPA (Single Page Application) que consume la API REST a través del API Gateway. Proporciona una interfaz intuitiva para la gestión de veterinarias.

## Características

- Single Page Application (SPA) con React Router
- Cliente HTTP con Axios
- Autenticación con JWT
- Context API para manejo de estado global
- Componentes reutilizables
- Hot Module Replacement (HMR) con Vite
- Build optimizado para producción

## Tecnologías

- React 19
- React Router DOM
- Axios
- Vite (build tool)
- ESLint

## Estructura del Proyecto

```
vetcore_frontend_msvc/
├── src/
│   ├── api/
│   │   └── axios.js             # Configuración de Axios
│   ├── components/
│   │   └── ...                  # Componentes reutilizables
│   ├── pages/
│   │   ├── Login.jsx            # Página de login
│   │   ├── Dashboard.jsx        # Dashboard principal
│   │   └── ...                  # Otras páginas
│   ├── context/
│   │   └── AuthContext.jsx      # Context de autenticación
│   ├── App.jsx                  # Componente principal con rutas
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── public/                      # Archivos estáticos
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
├── index.html                   # HTML principal
├── vite.config.js               # Configuración de Vite
├── Dockerfile                   # Para construcción de imagen
├── docker-compose.yml           # Para ejecución individual
└── package.json
```

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Gateway URL
VITE_API_URL=http://localhost:8000
```

**Importante:** Las variables de entorno en Vite deben tener el prefijo `VITE_` para ser accesibles en el código.

## Instalación y Ejecución

### Opción 1: Ejecución Local sin Docker (Desarrollo - Recomendado)

**Requisitos previos:**
- Node.js 18+ instalado
- API Gateway corriendo en http://localhost:8000

**Pasos:**

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env si es necesario
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

4. **Build para producción:**
   ```bash
   npm run build
   ```

   Los archivos optimizados se generarán en la carpeta `dist/`

5. **Preview del build de producción:**
   ```bash
   npm run preview
   ```

---

### Opción 2: Ejecución con Docker Compose

**Requisitos previos:**
- Docker Desktop instalado y corriendo

**Pasos:**

1. **Levantar el servicio:**
   ```bash
   docker-compose up
   ```

   Esto levantará:
   - Frontend en el puerto `5173`

2. **Levantar en segundo plano:**
   ```bash
   docker-compose up -d
   ```

3. **Ver logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Detener el servicio:**
   ```bash
   docker-compose down
   ```

---

### Opción 3: Construcción y Publicación de Imagen Docker

**Para construir la imagen localmente:**

```bash
# Construir con nombre local
docker build -t vetcore-frontend:latest .

# O construir con tu usuario de Docker Hub
docker build -t tuusuario/vetcore-frontend:latest .
```

**Para publicar en Docker Hub (opcional):**

1. **Login en Docker Hub:**
   ```bash
   docker login
   ```

2. **Construir con tu usuario:**
   ```bash
   docker build -t tuusuario/vetcore-frontend:latest .
   ```

3. **Publicar imagen:**
   ```bash
   docker push tuusuario/vetcore-frontend:latest
   ```

4. **Otros pueden descargar tu imagen:**
   ```bash
   docker pull tuusuario/vetcore-frontend:latest
   ```

---

## Estructura de Rutas

La aplicación utiliza React Router para el enrutamiento:

- `/` - Página principal / Landing
- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal (requiere autenticación)
- `/patients` - Lista de pacientes
- `/patients/new` - Crear nuevo paciente
- `/patients/:id` - Detalles del paciente
- ... (agregar más rutas según implementación)

---

## Autenticación

El frontend maneja la autenticación mediante JWT:

1. Usuario ingresa credenciales en `/login`
2. Se envía petición POST a `/api/auth/login` (vía API Gateway)
3. Si es exitoso, se recibe un token JWT
4. El token se almacena en el Context/localStorage
5. El token se incluye en todas las peticiones subsecuentes mediante Axios interceptors

### Uso del AuthContext

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  // ...
}
```

---

## Configuración de Axios

El cliente Axios está configurado en `src/api/axios.js`:

- **Base URL:** Se obtiene de `VITE_API_URL`
- **Interceptors:** Añaden automáticamente el token JWT a las peticiones
- **Headers:** Content-Type application/json por defecto

**Ejemplo de uso:**

```javascript
import axios from './api/axios';

// GET request
const patients = await axios.get('/api/patients');

// POST request
const newPatient = await axios.post('/api/patients', {
  name: 'Max',
  species: 'Perro'
});
```

---

## Scripts Disponibles

```bash
# Modo desarrollo (Hot reload)
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Linting con ESLint
npm run lint
```

---

## Linting

El proyecto usa ESLint para mantener la calidad del código:

```bash
# Verificar errores de lint
npm run lint

# Auto-fix de errores (si es posible)
npm run lint -- --fix
```

---

## Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test
```

---

## Troubleshooting

### Error: "Network Error" al hacer peticiones

- Verifica que el API Gateway esté corriendo en `http://localhost:8000`
- Verifica la configuración de `VITE_API_URL` en `.env`
- Revisa la consola del navegador para errores CORS

### Error: "Unauthorized" (401)

- El token JWT expiró o es inválido
- Cierra sesión y vuelve a iniciar sesión
- Verifica que el token se esté enviando correctamente en el header `Authorization`

### Los cambios no se reflejan

- Verifica que el servidor de desarrollo esté corriendo (`npm run dev`)
- Limpia el caché del navegador (Ctrl + Shift + R)
- Si usas Docker, reconstruye la imagen: `docker-compose up --build`

### Error: "Port 5173 is already in use"

- Detén otros procesos de Vite
- O cambia el puerto en `vite.config.js`:
  ```javascript
  export default {
    server: {
      port: 3000
    }
  }
  ```

---

## Construcción para Producción

### Build local:

```bash
npm run build
```

Los archivos optimizados se generarán en `dist/`:
- HTML minificado
- CSS optimizado
- JavaScript bundleado y minificado
- Assets optimizados

### Servir build de producción:

```bash
npm run preview
```

O usa cualquier servidor estático:

```bash
# Con serve
npx serve -s dist

# Con Python
python -m http.server -d dist
```

---

## Parte del Sistema VetCore

Este servicio es parte de **VetCore**, un sistema de microservicios para la gestión integral de veterinarias. VetCore está compuesto por:

- **Auth Service** - Autenticación y autorización
- **Patients Service** - Gestión de pacientes/mascotas
- **API Gateway** - Punto de entrada único y enrutamiento
- **Frontend** (este servicio) - Interfaz de usuario en React
- **Appointments Service** (próximamente) - Gestión de citas

Para ejecutar el sistema completo, consulta el repositorio `vetcore-infrastructure`.

---

## Licencia

Este proyecto es parte de VetCore y está bajo [indicar licencia].

## Contribuciones

[Indicar cómo contribuir al proyecto]

## Contacto

[Indicar información de contacto o enlaces al proyecto principal]
