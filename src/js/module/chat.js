import webSocket  from "./websocket.js"

export default class ChattApp {
    #inputbtn 
    #logInInput
    #logIncontainer
    #johnHeader
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

    constructor() {
        this.#websocket = new webSocket()

        this.#massage = {
            "type": "message",
            "data" : "The message text is sent using the data property",
            "username": "MyFancyUsername", 
            "channel": "my, not so secret, channel",
            "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
        }

        ////////////////log in container///////////////////
        this.#logIncontainer = document.createElement('div')
        this.#logIncontainer.className = 'logIn'
        this.logInText = document.createElement('p')
        this.logInText.innerText = 'log in to start chat'
        this.#logInInput = document.createElement('input')
        this.#inputbtn = document.createElement('button')
        this.#inputbtn.className = 'button'
        this.#inputbtn.id = 'logIn'
        this.#inputbtn.textContent = 'log in'
        this.#logIncontainer.appendChild(this.logInText)
        this.#logIncontainer.appendChild(this.#logInInput)
        this.#logIncontainer.appendChild(this.#inputbtn)
        //////////the selector////////////
        
        /////////////////////////chatContainer///////////////////////
        this.#chatContainer = document.createElement('div')
        this.#chatContainer.className ='chatContainer hidden'
        

        this.#johnHeader = document.createElement('h2')
        this.#johnHeader.innerText = ''
        this.#johnHeader.className = 'chat-header'
        this.#chatContainer.appendChild(this.#johnHeader)
        ////chat-msg div//////
        this.#chatMsg = document.createElement('div')
        this.#chatMsg.className = 'chat-msg'
            ///blue msg///
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
            ///gry msg///
        this.#gryMsg = document.createElement('div')
        this.#gryMsg.className = 'gray-msg msg'
        this.#chatMsg.appendChild(this.#gryMsg)
        

        this.#gryMsg.appendChild(this.#msgSender)
        this.#gryMsg.appendChild(this.#msgText)
        this.#gryMsg.appendChild(this.#msgSenderTime)


        this.#chatContainer.appendChild(this.#chatMsg)  
        //////form/////
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

        ////clear button////
        this.#clearBtn =  document.createElement('button')
        this.#clearBtn.className = 'button clear-button'
        this.#clearBtn.textContent = 'clear chat'
        this.#chatContainer.appendChild(this.#clearBtn)
        this.loggingIn()
        this.sendingMsgs()
    }


    getChatLogIn(){
        return this.#logIncontainer
    }

    getChat(){
        // document.body.appendChild(this.personSelectore,this.chatContainer)
        return this.#chatContainer
    }


    loggingIn(){
       
        this.#inputbtn.addEventListener('click', () => {
            
            if(this.#logInInput.value == ''){
                alert('you need to enter a valid user name')
            } else {
                this.#massage.username = this.#logInInput.value
                console.log(this.#massage.username)
                this.#logIncontainer.classList.add('hidden')
                this.#chatContainer.classList.remove('hidden')
                this.#johnHeader.innerText = this.#massage.username
                this.#chatInput.placeholder = `type here ${this.#massage.username}...`
                this.#websocket.addListner(this)
            }
            

        })
    }

    sendingMsgs(){
        this.#sendButton.addEventListener('click', (e) => {
            e.preventDefault()
            this.#massage.data = this.#chatInput.value
            console.log(this.#massage.data)
            this.#chatInput.value =''
            this.#websocket.sendMsg(this.#massage)
        })
    }



    newMessage(msg) {
        const newMsg = document.createElement('div')
        const msgSender = document.createElement('div')
        const msgText = document.createElement('div')
        const msgSenderTime = document.createElement('div')
        msgText.className = 'msg-text'
        msgSender.className = 'msg-sender'
        msgSenderTime.className = 'msg-timestamp'
        const msgData = JSON.parse(msg.data)
        msgText.innerText = msgData.data
        console.log('theMSG',msg)

        if(msgData.username === this.#massage.username){
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
        this.#chatMsg.scrollTop =  this.#chatMsg.scrollHeight
    }


}