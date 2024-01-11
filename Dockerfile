FROM node:alpine
RUN npm install -g nodemon
RUN npm install -g prettier
RUN npm install -g eslint
WORKDIR /app
COPY package.json .
RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]