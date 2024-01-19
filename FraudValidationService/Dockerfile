FROM node:14

RUN apt-get update && apt-get install -y kafkacat

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
 
COPY . .
 
RUN npm run build
 
RUN echo '#!/bin/bash\n\
while ! kafkacat -b kafka1:19092,kafka2:19093,kafka3:19094 -L; do\n\
  echo "Esperando a Kafka..."\n\
  sleep 5\n\
done\n\
echo "Kafka listo. Iniciando la aplicación..."\n\
exec node dist/src/app/start.js' > check_kafka.sh
 
RUN chmod +x check_kafka.sh
 
EXPOSE 3200
 
ENTRYPOINT ["./check_kafka.sh"]
