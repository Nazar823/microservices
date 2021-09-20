FROM node
WORKDIR /app
COPY ./package.json /app
RUN npm install
ENV REGISTRATION_SERVICE /.env?REGISTRATION_SERVICE
ENV GET_USERNAME /.env?GET_USERNAME
COPY . .
CMD ["node", "index.js"]