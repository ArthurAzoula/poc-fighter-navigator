import Peer from 'simple-peer';

let localStream;
let peer;

export const initializeWebRTC = async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        console.log('localStream:', localStream);

        // Créer une nouvelle instance peer-to-peer avec WebRTC
        peer = new Peer({ initiator: true, stream: localStream });

        peer.on('signal', signal => {
            console.log('Signal à envoyer à l\'autre peer:', signal);
            // Ici, vous enverriez ce signal à l'autre peer pour établir la connexion
        });

        peer.on('data', data => {
            const message = data.toString();
            console.log('Message reçu:', message);
            // Appel à une fonction de mise à jour du jeu avec le message reçu
        });
        
        return peer;

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de WebRTC:', error);
        return null;
    }
};

export const sendMessage = (message) => {
    if (peer) {
        peer.send(message);
    }
};

export const receiveMessage = (callback) => {
    if (peer) {
        peer.on('data', data => {
            const message = data.toString();
            callback(message);
        });
    }
};
