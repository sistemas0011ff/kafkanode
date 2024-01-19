#!/bin/sh
# entrypoint.sh

# Instala netcat si no está disponible
if ! which nc > /dev/null; then
  echo "Installing netcat..."
  apk add --no-cache netcat-openbsd
fi

# Espera a que la base de datos esté lista
while ! nc -z postgres 5432; do
  echo "Esperando a que PostgreSQL esté listo..."
  sleep 1
done

# Ejecuta las migraciones de Prisma
npx prisma migrate deploy

# Genera el cliente de Prisma
npx prisma generate

# Inicia la aplicación Node.js
exec node dist/src/app/start.js
