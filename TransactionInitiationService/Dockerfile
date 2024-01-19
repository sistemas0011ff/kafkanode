FROM node:14
WORKDIR /usr/src/app
 
COPY package*.json ./
 
RUN npm install
 
COPY prisma ./prisma
 
COPY . .
 
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
# Ejecuta las migraciones de Prisma, generando si es necesario\n\
if [ -d \"prisma/migrations\" ]; then\n\
  npx prisma migrate deploy\n\
else\n\
  npx prisma migrate dev --name init\n\
fi\n\
\n\
# Genera el cliente de Prisma\n\
npx prisma generate\n\
\n\
# Inicia la aplicación Node.js\n\
exec node dist/src/app/start.js" > /usr/src/app/entrypoint.sh
 
RUN chmod +x /usr/src/app/entrypoint.sh
 
RUN npm run build
 
EXPOSE 3199 
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

