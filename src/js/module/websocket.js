import ChattApp from './chat.js'

export default class TheWbSocket {
  #ws = null
  #listners = []
  /**
   * constructor that create a wbsocket and add event listner.
   */
  constructor () {
    if (this.#ws === null) {
      this.#ws = new WebSocket('wss://courselab.lnu.se/message-app/socket')
      this.#ws.addEventListener('open', () => {
        console.log('the web socket is opend and connected')
      })

      this.#ws.addEventListener('message', (e) => {
        // this to avoid getiing any notification in case of hardbeat
        if (JSON.parse(e.data).username === 'The Server' ||
          JSON.parse(e.data).username === 'Server') {
          return
        }
        console.log('new msg')
        this.notify(e)
      })

      this.#ws.addEventListener('close', () => {
        this.#ws = null
        this.#listners = []
        console.log('the web socket is closed')
      })
    }
  }

  /**
   *
   * @returns {WebSocket}the web socket
   */
  getWs () {
    return this.#ws
  }

  /**
   *
   * @param {ChattApp} lsnr is the instance of chat class
   */

  addListner (lsnr) {
    this.#listners.push(lsnr)
  }

  /**
   *
   * @param {object} msg msg object
   */
  notify (msg) {
    this.#listners.forEach(lsnr => {
      lsnr.newMessage(msg)
    })
  }

  /**
   *
   * @param {object} msg msg object that contain data
   */
  sendMsg (msg) {
    if (!this.#ws || this.#ws === 3) {
      console.log('The websocket is not connected to a server.')
    } else {
      this.#ws.send(JSON.stringify(msg))
      console.log('themeessaagge;', msg)
      this.cachMessages(msg)
    }
  }

  /**
   *
   * @param {object} msg msg object that contain data
   */
  cachMessages (msg) {
    let msgs = JSON.parse(localStorage.getItem('chatApp'))

    if (!msgs) {
      msgs = []
    }

    msgs.push({ username: msg.username, msg: msg.data, time: new Date().toLocaleString(), channel: msg.channel })

    while (msgs.length > 25) {
      msgs.shift()
    }

    localStorage.setItem('chatApp', JSON.stringify(msgs))
    console.log('cache is ok ')
  }
}
