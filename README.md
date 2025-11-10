# Prueba Técnica Davivienda - Frontend

Aplicación web de gestión de encuestas desarrollada con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Características

- ✅ Autenticación JWT con Spring Boot backend
- ✅ Gestión completa de encuestas (CRUD)
- ✅ Editor de preguntas con múltiples tipos
- ✅ Estado global con Zustand
- ✅ Integración con API REST
- ✅ Diseño responsivo con Tailwind CSS
- ✅ TypeScript para type safety

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Backend de Spring Boot ejecutándose (ver repositorio `prueba_davivienda_backend`)

## ⚙️ Configuración e Instalación

### Requisitos Previos

- **Node.js 18** o superior ([Download](https://nodejs.org/))
- **npm** o **yarn**
- **Backend** ejecutándose en `http://localhost:8080` (ver [prueba_davivienda_backend](../prueba_davivienda_backend))

### 1. Clonar el Repositorio

```bash
git clone https://github.com/oscarortiz1/prueba_davivienda.git
cd prueba_davivienda
```

### 2. Instalar Dependencias

```bash
npm install
# o con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Editar `.env` con la URL de tu backend:

```env
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
```

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### 5. Compilar para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🏗️ Arquitectura

```
src/
├── domain/              # Modelos de dominio
│   └── User.ts
├── pages/              # Páginas de la aplicación
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── SurveyEditor.tsx
├── stores/             # Estado global (Zustand)
│   ├── authStore.ts    # Autenticación
│   └── surveyStore.ts  # Encuestas
├── ui/components/      # Componentes reutilizables
│   ├── AuthForm.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Logo.tsx
└── App.tsx             # Componente raíz con rutas
```

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para autenticación:

1. El usuario se registra o inicia sesión
2. El backend devuelve un token JWT
3. El token se almacena en `localStorage`
4. Todas las peticiones incluyen el token en el header `Authorization: Bearer <token>`
5. Axios interceptor maneja automáticamente la inclusión del token

## 🌐 Integración con Backend

### Endpoints utilizados:

**Autenticación:**
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /auth/me` - Obtener usuario actual

**Encuestas:**
- `GET /surveys/my-surveys` - Listar mis encuestas
- `POST /surveys` - Crear encuesta
- `PUT /surveys/{id}` - Actualizar encuesta
- `DELETE /surveys/{id}` - Eliminar encuesta
- `PUT /surveys/{id}/publish` - Publicar encuesta

**Preguntas:**
- `POST /surveys/{surveyId}/questions` - Agregar pregunta
- `PUT /surveys/{surveyId}/questions/{questionId}` - Actualizar pregunta
- `DELETE /surveys/{surveyId}/questions/{questionId}` - Eliminar pregunta

### Formato de datos:

**Crear Encuesta:**
```typescript
{
  title: string,
  description: string
}
```

**Agregar Pregunta:**
```typescript
{
  title: string,
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DROPDOWN' | 'SCALE',
  options?: string[],
  required: boolean,
  order: number
}
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar build de producción
npm run lint         # Ejecutar linter
```

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Zustand** - Gestión de estado
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **React Router** - Enrutamiento

## 🔄 Flujo de Trabajo

1. **Registro/Login:**
   - Usuario ingresa credenciales
   - Backend valida y retorna JWT
   - Token se almacena y se usa para peticiones

2. **Crear Encuesta:**
   - Usuario crea encuesta con título y descripción
   - Backend asigna automáticamente el `createdBy` del JWT
   - Usuario agrega preguntas una por una
   - Opcionalmente publica la encuesta

3. **Gestión de Encuestas:**
   - Listar encuestas del usuario
   - Editar encuestas existentes
   - Eliminar encuestas
   - Publicar/despublicar

## � Documentación API (Swagger/OpenAPI)

El backend incluye **Swagger UI** para documentación interactiva de la API.

### 🔗 Acceder a Swagger

Con el backend ejecutándose, abre tu navegador en:

**http://localhost:8080/api/swagger-ui/index.html**

### ✨ Características de Swagger

- **🔍 Exploración Interactiva**: Ve todos los endpoints disponibles organizados por categorías
- **🧪 Pruebas en Vivo**: Ejecuta peticiones directamente desde el navegador
- **📋 Esquemas de Datos**: Ve la estructura exacta de requests y responses
- **🔐 Autenticación JWT**: Botón "Authorize" para probar endpoints protegidos
- **📝 Ejemplos**: Payloads de ejemplo para cada endpoint
- **💡 Descripciones**: Documentación detallada de cada parámetro

### 🚀 Cómo usar Swagger para probar la API

#### 1. Abrir Swagger UI
```
http://localhost:8080/api/swagger-ui/index.html
```

#### 2. Registrar un usuario (si no tienes uno)
- Expande **`auth-controller`** → **`POST /auth/register`**
- Click en **"Try it out"**
- Edita el body JSON:
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- Click en **"Execute"**
- Copia el **`token`** de la respuesta

#### 3. Autenticar en Swagger
- Click en el botón **"Authorize"** 🔓 (candado verde arriba a la derecha)
- Pega tu token JWT en el campo de valor (sin escribir "Bearer", solo el token)
- Click en **"Authorize"** y luego **"Close"**
- Ahora el candado debe aparecer cerrado 🔒

#### 4. Probar cualquier endpoint
- Ahora todos los endpoints protegidos incluirán automáticamente tu token
- Expande cualquier endpoint (por ejemplo: `GET /surveys/my-surveys`)
- Click en **"Try it out"**
- Modifica los parámetros si es necesario
- Click en **"Execute"**
- Ve la respuesta en tiempo real con:
  - Código de estado HTTP
  - Headers de respuesta
  - Body de respuesta formateado
  - Tiempo de respuesta

### 📄 Endpoints Swagger Adicionales

Además de la interfaz web, puedes obtener la especificación OpenAPI en diferentes formatos:

- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

Estos archivos pueden usarse para:
- 📥 Importar en **Postman** o **Insomnia**
- 🛠️ Generar clientes automáticos en diferentes lenguajes
- 🧪 Integración con herramientas de testing
- 📖 Generar documentación estática

### 💡 Ejemplo de uso completo

```bash
# 1. Asegúrate de que el backend esté corriendo
# En el directorio del backend:
cd prueba_davivienda_backend
mvn spring-boot:run

# 2. Abre Swagger en tu navegador
# http://localhost:8080/api/swagger-ui/index.html

# 3. Obtén un token:
#    POST /auth/login
#    Body: { "email": "user@example.com", "password": "password123" }

# 4. Autoriza con el token en el botón "Authorize"

# 5. Prueba crear una encuesta:
#    POST /surveys
#    Body: { "title": "Mi encuesta", "description": "Descripción" }

# 6. Agregar preguntas:
#    POST /surveys/{surveyId}/questions
```

## �📝 Notas de Desarrollo

- El token JWT se renueva automáticamente en cada petición exitosa
- Las encuestas se crean sin preguntas inicialmente, estas se agregan después
- Los tipos de pregunta en frontend ('multiple-choice') se convierten a formato backend ('MULTIPLE_CHOICE')
- El estado de autenticación persiste en localStorage

## 🐛 Solución de Problemas

**Error de CORS:**
- Verificar que el backend tenga configurado CORS para `http://localhost:5173`
- Revisar `application.properties` del backend

**Token inválido:**
- Limpiar localStorage: `localStorage.clear()`
- Volver a iniciar sesión

**Backend no responde:**
- Verificar que Spring Boot esté ejecutándose en puerto 8080
- Verificar la URL en archivo `.env`

**Swagger no carga:**
- Verificar que el backend esté ejecutándose
- Acceder a http://localhost:8080/api/swagger-ui/index.html
- Revisar la consola del backend por errores
- Verificar que la dependencia `springdoc-openapi-starter-webmvc-ui` esté en el pom.xml

## 🔗 Repositorios Relacionados

- Backend: `prueba_davivienda_backend` (Spring Boot + Firebase)
