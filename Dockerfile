# Etapa de compilación
FROM node:16.14-alpine as build-stage

# Se establece el directorio de trabajo dentro del contenedor 
WORKDIR /app

COPY package*.json ./

# Instalacion de las dependencias del proyecto Node.js.
RUN npm install

# Copia todos los archivos y directorios del directorio de construcción local al directorio /app en el contenedor.
COPY . .

# Se construye el proyecto con la configuracion de produccion
RUN npm run build --configuration=production

# Etapa de producción
FROM nginx:latest

# Eliminar los archivos existentes en la carpeta html
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos estáticos de la etapa de compilación al directorio de Nginx
COPY --from=build-stage /app/dist/daw2023-reservas-cerutti-goia /usr/share/nginx/html

# Exponer el puerto 80 para acceder a la aplicación desde el host
EXPOSE 80

# Iniciar el servidor Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
