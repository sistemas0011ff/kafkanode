# PRY_REGISTRA_TRX_BO

## Descripción

Es una aplicación de Node.js que proporciona funcionalidades del proceso de ventas. Este proyecto utiliza TypeScript para un desarrollo más seguro y predecible, y se conecta a una base de datos Oracle utilizando.

## Cómo instalar

1. Asegúrate de tener Node.js y npm instalados en tu máquina.
2. Clona este repositorio en tu máquina local.
3. En la carpeta del proyecto, ejecuta `npm install` para instalar las dependencias necesarias.
4. Configura las variables de entorno necesarias.
5. Ejecuta `npm start:local` para iniciar la aplicación.

## Contacto

Si tienes alguna pregunta sobre este proyecto, no dudes en ponerse en contacto conmigo en [RIPLEY-RETAIL].
# cpe_ship_peru

npx prisma db pull
npx prisma generate

#para el caso de tener el modelo se inica la migración
npx prisma migrate dev --name init_transactions
#modificacion
npx prisma migrate dev --name modify_transfer_type_id
#tambien ejecutar
npx prisma generate

obtener la estructura de carpetas:
find . \( -name node_modules -o -name .git -o -name dist -o -name .dockerignore -o -name .env -o -name .gitignore \) -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' > output.txt
