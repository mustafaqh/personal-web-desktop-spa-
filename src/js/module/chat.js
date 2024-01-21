import TheWebSocket from './websocket.js'

export default class ChattApp {
  #inputbtn
  #logInInput
  #logIncontainer
  #logInText
  #header
  #chatContainer
  #chatMsg
  #blueMsg
  #msgSender
  #msgSenderTime
  #gryMsg
  #msgText
  #inputForm
  #chatInput
  #sendButton
  #clearBtn
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
    this.#editImg.src = '../src/img//chat/edit.png'

    this.#editBtn.appendChild(this.#editImg)
    this.#editDiv.appendChild(this.#editBtn)
    this.#editInputDive.appendChild(this.#ediInput)
    this.#editDiv.appendChild(this.#editInputDive)
    this.#headerDiv.appendChild(this.#editDiv)

    /// /chat-msg div//////
    this.#chatMsg = document.createElement('div')
    this.#chatMsg.className = 'chat-msg'
    /// blue msg///
    this.#blueMsg = document.createElement('div')
    this.#blueMsg.className = 'blue-msg msg'
    this.#chatMsg.appendChild(this.#blueMsg)

    this.#msgSender = document.createElement('div')
    this.#msgSender.className = 'msg-sender'
    this.#msgSender.innerText = 'you'
    this.#msgText = document.createElement('div')
    this.#msgText.className = 'msg-text'
    this.#msgText.innerText = 'hey jane, what is up?'
    this.#msgSenderTime = document.createElement('div')
    this.#msgSenderTime.className = 'msg-timestamp'
    this.#msgSenderTime.innerText = '10:30 AM'

    this.#blueMsg.appendChild(this.#msgSender)
    this.#blueMsg.appendChild(this.#msgText)
    this.#blueMsg.appendChild(this.#msgSenderTime)
    /// gry msg///
    this.#gryMsg = document.createElement('div')
    this.#gryMsg.className = 'gray-msg msg'
    this.#chatMsg.appendChild(this.#gryMsg)

    this.#gryMsg.appendChild(this.#msgSender)
    this.#gryMsg.appendChild(this.#msgText)
    this.#gryMsg.appendChild(this.#msgSenderTime)

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

  getChatLogIn () {
    return this.#logIncontainer
  }

  getChat () {
    // document.body.appendChild(this.personSelectore,this.chatContainer)
    return this.#chatContainer
  }

  loggingIn () {
    this.#inputbtn.addEventListener('click', (e) => {
      e.preventDefault()
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
    })
  }

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
      newMsg.className = 'blue-msg msg'
      msgSender.innerText = 'you'
    } else {
      newMsg.className = 'gray-msg msg'
      msgSender.innerText = msgData.username
    }

    msgSenderTime.innerText = new Date().toLocaleString()
    newMsg.appendChild(msgSender)
    newMsg.appendChild(msgText)
    newMsg.appendChild(msgSenderTime)
    this.#chatMsg.appendChild(newMsg)
    this.#chatMsg.scrollTop = this.#chatMsg.scrollHeight
  }

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
          newMsg.className = 'blue-msg msg'
          msgSender.innerText = 'You'
        } else {
          newMsg.className = 'gray-msg msg'
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
