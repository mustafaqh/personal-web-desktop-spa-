export default class webSocket {
    #ws = null
    #listners = []

    constructor(){
        if(this.#ws === null) {
            this.#ws = new WebSocket("wss://courselab.lnu.se/message-app/socket")
            this.#ws.addEventListener('open', () => {
            console.log('the web socket is opend and connected')
            })
        }
    }
    
}