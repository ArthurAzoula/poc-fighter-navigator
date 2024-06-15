# Utiliser une image officielle de Node.js comme image de base
FROM node:16

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel l'application sera accessible
EXPOSE 3001

# Commande pour démarrer l'application avec Vite
CMD ["npm", "run", "dev"]
