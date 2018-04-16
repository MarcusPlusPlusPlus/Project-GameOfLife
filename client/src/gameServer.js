import axios from 'axios'
import config from './config'

/* Il n'est pas nécessaire de comprendre la manière dont on GameServer 
   communique avec le serveur ici, en revanche faites bien attention
   à la manière dont il faut utiliser les méthodes de GameServer, et à
   ce a quoi elles servent !

   GameServer.loadSeed(seedURL) : Retourne une promise qui télécharge le contenu de seedURL
   GameServer.init(seed) : Retourne une promise qui envoie seed au serveur et renvoie sa réponse dans le then
   GameServer.next() : Ne retourne rien, demande simplement au serveur de calculer le prochain cycle de vie du jeu
   GameServer.onMessage() : Est appellée à chaque fois que le serveur vous envoie un message ou une réponse à un de vos messages

   Pour info (il n'est pas indispensable de le savoir pour comprendre le projet), les messages que le serveur comprend sont :

   INIT${SEED} // Demande au serveur d'initialiser une nouvelle grille avec la seed indiquée
   NEXT // Demande au serveur de calculer le prochain cycle du jeu de la vie

 */

if (!config['DEBUG']) {
    console.log = () => {}
}

class GameServer {
    loadSeed(seedURL) {
        /* 
           Retourne une Promise qui charge une seed depuis seedURL
        */
        console.log('gameServer :: loadSeed', seedURL)
        return new Promise((resolve, reject) => {
            axios
                .get(seedURL) /* Requête HTTP pour récupérer ma seed, retourne une Promise */
                .then(response => {
                    if (response.data) {
                        resolve(response.data)
                    } else {
                        reject(response)
                    }
                })
                .catch(reject)
        })
    }
    init(seed) {
        /*
           Retourne une Promise qui envoie la seed au serveur comme seed de départ 
           et lance une nouvelle partie.
           Une fois la partie lancée, un tableau de cellules est renvoyé par les serveur.
        */
        // const seedArray = seed.split("\n")
        // console.log(`Height : ${seedArray.length}     Width : ${seedArray[0].length}`)
        // seedArray.forEach(element => { console.log(element + "\n") })
        
        return new Promise((resolve, reject) => {
            console.log('GameServer :: init')
            this.ws = new WebSocket('ws://127.0.0.1:8080') 
            this.ws.onopen = () => {
                this.ws.send('INIT'+seed)
                resolve()
            }
            this.ws.onmessage = (message) => {
                this.onMessage(message)
            }
            this.ws.onerror = error => {console.error(error)}
            this.ws.onclose = () => {console.error('GameServer :: socket closed')}
        }), {"height": seed.split("\n").length, "width": seed.split("\n")[0].length}
    }
    next() {
        /* 
           Demande au serveur de calculer le prochain cycle de vie. Ne retourne rien
        */
        if (this.ws) {
            return this.ws.send('NEXT')
        } else {
            console.error('GameServer :: next', 'You need to call gameServer.init before gameServer.next!')
        }
    }
    onMessage(message) {
        /*
          Affiche les message envoyés par le serveur
         */
        console.log('GameServer :: server sent a new message', message)
    }
}

export default new GameServer()
