export default class webSocket {
    #ws = null
    #listners = []

    constructor(){
        if(this.#ws === null) {
            this.#ws = new WebSocket("wss://courselab.lnu.se/message-app/socket")
            this.#ws.addEventListener('open', () => {
            console.log('the web socket is opend and connected')
            })

            this.#ws.addEventListener("message", (e) => {
                console.log('new msg')
			})

            this.#ws.addEventListener('close', () => {
                this.#ws = null
                this.#listners = []
                console.log('the web socket is closed')
            })
        }
    }
    
}