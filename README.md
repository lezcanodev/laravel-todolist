
# Instalación de Todo-List Laravel (API) + React (Frontend)

## 📋 Pre-requisitos

- Gestor de depencias Composer
- Gestor de depencias npm/yarn
- Tener MySQL instalado

## Instalación
###### 🛠 Configuración base de datos
crear la base de datos de prueba con lo siguiente
o otro:
```bash
CREATE DATABASE laravel_todolist;
```

###### 🛠 Configuración Backend (Laravel)
Dentro de la carpeta api, hacer lo siguiente
1. Instalar dependencias:
```bash
    composer install
```
2. Cambiar el nombre de .env.example a .env
3. en .env configurar los datos de conexion a 
la base de datos mysql.
4. ejecutar las migraciones:
```bash
php artisan migrate
```
5. ejecutar las seeders:
```bash
php artisan db:seed
```
6. Correr el proyecto:
ejecutamos el servidor en el puerto 8000
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

###### 🛠 Configuración Frontend (Laravel)
Dentro de la carpeta todolist, hacer lo siguiente:
1. instalar las dependencias
```bash
    npm install
```
2. correr el servidor
```bash
    npm run dev
```
3. ir a la url por defecto http://localhost:5173