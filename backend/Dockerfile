FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN echo "# Banco de Dados" > .env && \
    echo "DB_HOST=db" >> .env && \
    echo "DB_PORT=3306" >> .env && \
    echo "DB_USERNAME=root" >> .env && \
    echo "DB_PASSWORD=root" >> .env && \
    echo "DB_NAME=neocredito" >> .env && \
    echo "" >> .env && \
    echo "# RabbitMQ" >> .env && \
    echo "RABBITMQ_URL=amqp://rabbitmq:5672" >> .env

RUN npm run build

EXPOSE 3000 3002

CMD ["npm", "run", "start:prod"]
