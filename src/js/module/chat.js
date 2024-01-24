import TheWebSocket from './websocket.js'
/**
 * a class that create the elements of the chat app and ccontains the function that are neededd in the chat app.
 */
export default class ChattApp {
  #inputbtn
  #logInInput
  #logIncontainer
  #logInText
  #header
  #chatContainer
  #chatMsg
  #sentMsg
  #msgSender
  #msgSenderTime
  #recived
  #msgText
  #inputForm
  #chatInput
  #sendButton
  #massage
  #websocket
  #headerDiv
  #editBtn
  #editImg
  #emojiDiv
  #emojis
  #editDiv
  #emojiButton
  #ediInput
  #editInputDive
  #userName

  /**
   * chat app constructor.
   */
  constructor () {
    this.#websocket = new TheWebSocket()

    this.#massage = {
      type: 'message',
      data: 'The message text is sent using the data property',
      username: 'MyFancyUsername',
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }

    /// /////////////log in container///////////////////
    this.#logIncontainer = document.createElement('div')
    this.#logIncontainer.className = 'logIn'
    this.#logInText = document.createElement('p')
    this.#logInText.innerText = '🔑 log in to start chating ...'
    this.#logInInput = document.createElement('input')
    this.#inputbtn = document.createElement('button')
    this.#inputbtn.className = 'button'
    this.#inputbtn.id = 'logIn'
    this.#inputbtn.textContent = 'log in'
    this.#logIncontainer.appendChild(this.#logInText)
    this.#logIncontainer.appendChild(this.#logInInput)
    this.#logIncontainer.appendChild(this.#inputbtn)
    /// ///////the selector////////////

    /// //////////////////////chatContainer///////////////////////
    this.#chatContainer = document.createElement('div')
    this.#chatContainer.className = 'chatContainer hidden'

    this.#headerDiv = document.createElement('div')
    this.#headerDiv.className = 'headerDiv'
    this.#header = document.createElement('h2')
    this.#header.innerText = ''
    this.#header.className = 'chat-header'
    this.#headerDiv.appendChild(this.#header)
    this.#chatContainer.appendChild(this.#headerDiv)

    this.#editDiv = document.createElement('div')
    this.#editDiv.className = 'editDiv'
    this.#editBtn = document.createElement('button')
    this.#editBtn.className = 'editBtn'
    this.#editInputDive = document.createElement('div')
    this.#editInputDive.className = 'hidden'
    this.#ediInput = document.createElement('input')
    this.#ediInput.className = 'ediInput'
    this.#ediInput.placeholder = 'enter you new name'

    this.#editImg = document.createElement('img')
    this.#editImg.className = 'editImg'
    const CHAT_PIC = (new URL('../../img/chat/edit.png', import.meta.url)).href
    this.#editImg.src = `${CHAT_PIC}`

    this.#editBtn.appendChild(this.#editImg)
    this.#editDiv.appendChild(this.#editBtn)
    this.#editInputDive.appendChild(this.#ediInput)
    this.#editDiv.appendChild(this.#editInputDive)
    this.#headerDiv.appendChild(this.#editDiv)

    /// /chat-msg div//////
    this.#chatMsg = document.createElement('div')
    this.#chatMsg.className = 'chat-msg'
    /// blue msg///
    this.#sentMsg = document.createElement('div')
    this.#sentMsg.className = 'sent-msg msg'
    // this.#chatMsg.appendChild(this.#sentMsg)

    this.#msgSender = document.createElement('div')
    this.#msgSender.className = 'msg-sender'
    this.#msgSender.innerText = 'you'
    this.#msgText = document.createElement('div')
    this.#msgText.className = 'msg-text'
    this.#msgText.innerText = ''
    this.#msgSenderTime = document.createElement('div')
    this.#msgSenderTime.className = ''
    this.#msgSenderTime.innerText = ''
    /// recived msg///
    this.#recived = document.createElement('div')
    this.#recived.className = 'recived-msg msg'

    this.#chatContainer.appendChild(this.#chatMsg)
    /// ///form/////
    this.#inputForm = document.createElement('form')
    this.#inputForm.className = 'chat-input-form'
    this.#chatContainer.appendChild(this.#inputForm)

    this.#chatInput = document.createElement('input')
    this.#chatInput.id = 'input'
    this.#chatInput.className = 'chat-input'
    this.#chatInput.placeholder = ''

    this.#sendButton = document.createElement('button')
    this.#sendButton.className = 'button send-button'
    this.#sendButton.type = 'submit'
    this.#sendButton.textContent = 'send'
    this.#inputForm.appendChild(this.#chatInput)
    this.#inputForm.appendChild(this.#sendButton)
    this.#emojiDiv = document.createElement('div')
    this.#emojiDiv.className = 'emojis hidden'

    this.#emojis = ['😂', '😭', '😼', '😎', '👍', '🙏', '😀', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎']
    this.#emojiButton = document.createElement('button')
    this.#emojiButton.className = 'emojiButton'
    this.#inputForm.appendChild(this.#emojiButton)
    this.#inputForm.appendChild(this.#emojiDiv)
    this.#emojiButton.textContent = '😀'
    this.#userName = ''
    this.loggingIn()
    this.sendingMsgs()
    this.editUserName()
    this.emojiList()
  }

  /**
   *
   * @returns {Element}  the container of the look in window.
   */
  getChatLogIn () {
    return this.#logIncontainer
  }

  /**
   *
   * @returns {Element} the chat app container.
   */
  getChat () {
    return this.#chatContainer
  }

  /**
   * adding event listner to the logging in button.
   */
  loggingIn () {
    this.#inputbtn.addEventListener('click', (e) => {
      e.preventDefault()
      this.loggingInAction()
    })

    this.#logInInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        this.loggingInAction()
      }
    })
  }

  loggingInAction () {
    if (this.#logInInput.value === '') {
      alert('you need to enter a valid user name')
    } else {
      this.#userName = this.#logInInput.value
      this.#massage.username = this.#userName
      console.log('user name :', this.#userName)
      this.#logIncontainer.classList.add('hidden')
      this.#chatContainer.classList.remove('hidden')
      this.#header.innerText = ` 👩‍👨‍👦${this.#massage.username}`
      this.#chatInput.placeholder = `type here ${this.#massage.username}...`
      this.#websocket.addListner(this)
      this.getCachedMsgs(this.#userName)
    }
  }

  /**
   * the fucntion which is responsable to take the chat input value and add it to message data,
   *  and then pass the msg to function that is responsable to send it websocket.
   */
  sendingMsgs () {
    this.#sendButton.addEventListener('click', (e) => {
      e.preventDefault()
      if (this.#chatInput.value === '') {
        alert('You cant send empty msgs!')
      } else {
        this.#massage.data = this.#chatInput.value
        console.log(this.#massage.data)
        this.#chatInput.value = ''
        this.#websocket.sendMsg(this.#massage)
      }
    })
  }

  /**
   * A function that takes msg data and shows the message in the chat app.
   * @param {object} msg - The message object containing the data to be displayed.
   */
  newMessage (msg) {
    const newMsg = document.createElement('div')
    const msgSender = document.createElement('div')
    const msgText = document.createElement('div')
    const msgSenderTime = document.createElement('div')
    msgText.className = 'msg-text'
    msgSender.className = 'msg-sender'
    msgSenderTime.className = 'msg-timestamp'
    const msgData = JSON.parse(msg.data)
    msgText.innerText = msgData.data
    console.log('theMSG', msg)

    if (msgData.username === this.#userName) {
      newMsg.className = 'sent-msg msg'
      msgSender.innerText = 'you'
    } else {
      newMsg.className = 'recived-msg msg'
      msgSender.innerText = msgData.username
    }

    msgSenderTime.innerText = new Date().toLocaleString()
    newMsg.appendChild(msgSender)
    newMsg.appendChild(msgText)
    newMsg.appendChild(msgSenderTime)
    this.#chatMsg.appendChild(newMsg)
    this.#chatMsg.scrollTop = this.#chatMsg.scrollHeight
  }

  /**
   * function that bring the msgs from the local stoage,
   * and show it in the chat
   */
  getCachedMsgs () {
    let msgs = JSON.parse(localStorage.getItem('chatApp'))

    if (!msgs) {
      msgs = []
    } else {
      msgs.forEach(element => {
        console.log(element)
      })
      for (let i = 0; i < msgs.length; i++) {
        const newMsg = document.createElement('div')
        const msgSender = document.createElement('div')
        const msgText = document.createElement('div')
        const msgSenderTime = document.createElement('div')
        msgText.className = 'msg-text'
        msgSender.className = 'msg-sender'
        msgSenderTime.className = 'msg-timestamp'
        msgText.innerText = msgs[i].msg

        if (msgs[i].username === this.#massage.username) {
          newMsg.className = 'sent-msg msg'
          msgSender.innerText = 'You'
        } else {
          newMsg.className = 'recived-msg msg'
          msgSender.innerText = msgs[i].username
        }

        msgSenderTime.innerText = msgs[i].time
        newMsg.appendChild(msgSender)
        newMsg.appendChild(msgText)
        newMsg.appendChild(msgSenderTime)
        this.#chatMsg.appendChild(newMsg)
        this.#chatMsg.scrollTop = this.#chatMsg.scrollHeight
      }
    }
  }

  /**
   * function that provide the ability of changing the user name
   */
  editUserName () {
    const storedMsgs = JSON.parse(localStorage.getItem('chatApp'))
    this.#ediInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (this.#ediInput.value === '') {
          alert('Please enter a username')
        } else {
          this.#header.innerText = ` 👩‍👨‍👦${this.#ediInput.value}`
          this.#editInputDive.classList.toggle('hidden')
          this.#chatInput.placeholder = `type here ${this.#ediInput.value}...`
          if (storedMsgs) {
            for (let i = 0; i < storedMsgs.length; i++) {
              if (storedMsgs[i].username === this.#userName) {
                storedMsgs[i].username = this.#ediInput.value
              }
              localStorage.setItem('chatApp', JSON.stringify(storedMsgs))
            }
          } else {
            return
          }
          this.#ediInput.value = ''
        }
      }
    })

    this.#editBtn.addEventListener('click', () => {
      this.#editInputDive.classList.toggle('hidden')
    })
  }

  /**
   * fubction to add event listener to the emojis to print them in the chat input
   */
  emojiList () {
    for (let i = 0; i < this.#emojis.length; i++) {
      const emoji = document.createElement('div')
      emoji.innerHTML = this.#emojis[i]
      emoji.className = 'emoji'
      this.#emojiDiv.appendChild(emoji)
      emoji.addEventListener('click', () => {
        this.#chatInput.value = this.#chatInput.value + this.#emojis[i]
      })
    }

    this.#emojiButton.addEventListener('click', (e) => {
      e.preventDefault()
      this.#emojiDiv.classList.toggle('hidden')
    })
  }
}
