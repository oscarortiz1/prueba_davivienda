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

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd prueba_davivienda
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con la URL de tu backend:
```env
VITE_API_URL=http://localhost:8080/api
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

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

## 📝 Notas de Desarrollo

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

## 🔗 Repositorios Relacionados

- Backend: `prueba_davivienda_backend` (Spring Boot + Firebase)
