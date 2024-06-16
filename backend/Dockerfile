# Utiliser une image officielle de Node.js comme image de base
FROM node:20

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Recompiler les modules natifs
RUN npm rebuild

# Exposer le port sur lequel l'application sera accessible
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
