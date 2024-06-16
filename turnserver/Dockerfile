# Utilisez une image de base officielle pour Coturn
FROM coturn/coturn:latest

# Copiez le fichier de configuration dans l'image Docker
COPY turnserver.conf /etc/turnserver.conf

# Exposez les ports nécessaires pour STUN/TURN
EXPOSE 3478
EXPOSE 3478/udp
EXPOSE 5349
EXPOSE 5349/udp

# Commande pour démarrer le serveur Coturn
CMD ["turnserver", "-c", "/etc/turnserver.conf", "--log-file=/var/log/turnserver/turnserver.log", "--lt-cred-mech"]
