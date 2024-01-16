import ChattApp from "./module/chat.js"


const chat = new ChattApp()

document.appendChild(chat.getChatLogIn)
document.appendChild(chat.getChat())