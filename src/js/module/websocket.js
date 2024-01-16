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
    
    getWs(){
        return this.#ws
    }


    
    addListner(lsnr){
        this.#listners.push(lsnr)
    }

    notify(msg){
        this.#listners.forEach(lsnr => {
			lsnr.newMessage(msg)
		})
    }

    sendMsg(msg){
        if (!this.#ws || this.#ws === 3) {
            console.log('The websocket is not connected to a server.')
          } else {
            this.#ws.send(JSON.stringify(msg))
            console.log('themeessaagge;',msg)
          }
    }
}