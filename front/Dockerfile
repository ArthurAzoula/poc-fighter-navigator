FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

# Commande pour démarrer l'application avec Vite
CMD ["npm", "run", "preview"]
