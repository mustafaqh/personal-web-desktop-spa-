export default class ChattApp {
    #inputbtn = document.createElement('button')
    #ligInInput = document.createElement('input')
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
        this
        this.#inputbtn = document.createElement('button')
        this.#inputbtn.className = 'button'
        this.#inputbtn.id = 'logIn'
        this.#inputbtn.textContent = 'log in'
        this.#logIncontainer.appendChild(this.logInText)
        this.#logIncontainer.appendChild(this.#ligInInput)
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
    }


    getChatLogIn(){
        return this.#logIncontainer
    }

    getChat(){
        // document.body.appendChild(this.personSelectore,this.chatContainer)
        return this.#chatContainer
    }
}