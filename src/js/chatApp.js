import ChattApp from "./module/chat.js"


const chat = new ChattApp()
document.body.appendChild(chat.getChatLogIn())
document.body.appendChild(chat.getChat())