export default class Windows {
    #windowsContainer
    #windowBar
    #WindowsName
    #WindowHeader
    #minimizBtn
    #closeBtn
    
    #minimizeIcon
    #closeIcon

    constructor(){
        this.#windowsContainer = document.createElement('div')
        this.#windowsContainer.className = 'windowsContainer'

        this.#windowBar = document.createElement('div')
        this.#windowBar.className = 'WindowBar'

        this.#WindowsName = document.createElement('div')
        this.#WindowsName.className = 'widowsName'

        this.#WindowHeader  = document.createElement('p')
        this.#WindowHeader.className = 'winowHeader'

        this.#minimizBtn = document.createElement('button')
        this.#minimizBtn.className = 'minmize'

        this.#closeBtn = document.createElement('button')
        this.#closeBtn.className = 'close'

        this.#minimizeIcon = document.createElement('img')
        this.#minimizeIcon.src = '../src/img/mini.png'


        this.#closeIcon = document.createElement('img')
        this.#closeIcon.src = '../src/img/close.png'

        this.#closeBtn.appendChild(this.#closeIcon)
        this.#minimizBtn.appendChild(this.#minimizeIcon)

        this.#WindowsName.appendChild(this.#WindowHeader)

        this.#windowBar.appendChild(this.#WindowsName)
        this.#windowBar.appendChild(this.#minimizBtn)
        this.#windowBar.appendChild(this.#closeBtn)

        this.#windowsContainer.appendChild(this.#windowBar)
    }

    appendWindow(element) {
        element.appendChild(this.#windowsContainer)
    }

    minimizeWindow() {
        this.#minimizBtn.addEventListener('click', () => {
            this.#windowsContainer.classList.add('hidden')
        }) 
    }


    closeWindow(){
        this.#closeBtn.addEventListener('click', () => {
            this.#windowsContainer.remove()
        })
    }

}