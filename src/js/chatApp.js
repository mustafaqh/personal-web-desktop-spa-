import ChattApp from "./module/chat.js"


const chat = new ChattApp()
const holeContainer = document.createElement('div')

document.body.appendChild(chat.getChatLogIn())
document.body.appendChild(chat.getChat())