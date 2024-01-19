# Usa la versión 14 de Node.js como imagen base
FROM node:14

# Crea un directorio en el contenedor para la aplicación
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json (si existe) al directorio de la aplicación
COPY package*.json ./

# Instala todas las dependencias (incluyendo las dependencias de desarrollo)
RUN npm install

# Copia los archivos de Prisma
COPY prisma ./prisma

# Copia el resto del código fuente de la aplicación al contenedor
COPY . .

# Crea el archivo entrypoint.sh y escribe el script en él
RUN echo "#!/bin/sh\n\
# Instala netcat si no está disponible\n\
if ! which nc > /dev/null; then\n\
  apt-get update && apt-get install -y netcat\n\
fi\n\
\n\
# Espera a que la base de datos esté lista\n\
while ! nc -z postgres 5432; do\n\
  echo 'Esperando a que PostgreSQL esté listo...'\n\
  sleep 1\n\
done\n\
\n\
# Realiza el db pull y luego genera el cliente de Prisma\n\
npx prisma db pull\n\
npx prisma generate\n\
\n\
# Inicia la aplicación Node.js\n\
exec node dist/src/app/start.js" > /usr/src/app/entrypoint.sh
 
RUN chmod +x /usr/src/app/entrypoint.sh 
RUN npm run build
 
EXPOSE 3202

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
