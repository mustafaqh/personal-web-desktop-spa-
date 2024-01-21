export default class Windows {
    #windowsContainer
    #windowBar
    #WindowsName
    #WindowHeader
    #minimizBtn
    #closeBtn
    #minimizeIcon
    #closeIcon
    
    #widowZindex
    constructor(){
        this.#windowsContainer = document.createElement('div')
        this.#windowsContainer.className = 'windowsContainer'
        this.#windowsContainer.draggable = 'true'
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
        this.#minimizeIcon.className = 'minimizeIcon'

        this.#closeIcon = document.createElement('img')
        this.#closeIcon.src = '../src/img/close.png'
        this.#closeIcon.className = 'closeIcon'
        this.#closeBtn.appendChild(this.#closeIcon)
        this.#minimizBtn.appendChild(this.#minimizeIcon)

        this.#WindowsName.appendChild(this.#WindowHeader)

        this.#windowBar.appendChild(this.#WindowsName)
        this.#windowBar.appendChild(this.#minimizBtn)
        this.#windowBar.appendChild(this.#closeBtn)

        this.#windowsContainer.appendChild(this.#windowBar)
        this.#widowZindex = 1
        // this.#windowContent = document.createElement('div')
        // this.#windowContent.className = 'content'

        // this.#windowsContainer.appendChild(this.#windowContent)
        
        // this.dragDrop()
        this.minimizeWindow()
        // this.closeWindow()
       
    }

    returnWindow() {
        return this.#windowsContainer
    }
    appendWindow(element) {
        element.appendChild(this.#windowsContainer)
    }

    appendWindowChild(child) {
        this.#windowsContainer.appendChild(child)
    }

    windowName(name) {
        this.#WindowHeader.textContentext = name
    }

    minimizeWindow() {
        this.#minimizBtn.addEventListener('click', () => {
            this.#windowsContainer.classList.add('hidden')
        }) 
    }

    returnCloseButton() {
        return this.#closeBtn
    }

    // closeWindow(){
    //     this.#closeBtn.addEventListener('click', () => {
    //         this.#windowsContainer.remove()
    //     })
    // }
    
    // dragableWindow() {
    //     this.#windowsContainer.addEventListener('dragstart', (event) => {
    //         console.log('DRAG START', event)
        
    //         const style = window.getComputedStyle(event.target,null)
    //         const startX = parseInt(style.getPropertyValue('left'), 10) - event.clientX
    //         const startY = parseInt(style.getPropertyValue('top'),10) -event.clientY
    //         const start ={
    //             posX: startX,
    //             posY: startY
    //         }
        
    //         event.dataTransfer.setData('application/json', JSON.stringify(start))
    //         console.log('start position', start)
    //     })
    // }

    // droppingWindow() {
    //     document.body.addEventListener('dragover', (event) => {
    //         console.log('DRAG OVER DROP ZONE', event)
    //         event.preventDefault()
    //     })
        
    //     document.body.addEventListener('drop', (event) => {
    //         console.log('DROPPED ON DROP ZONE', event)
        
    //         const start = JSON.parse(event.dataTransfer.getData('application/json'))
    //         const dropX = event.clientX
    //         const dropY = event.clientY
    //         console.log('drop position', [dropX,dropY])
        
    //         this.#windowsContainer.style.left = (dropX + start.posX) + 'px'
    //         this.#windowsContainer.style.top = (dropY + start.posY) + 'px'
    //     })
    // }

    dragDrop(container) {
        
        this.#windowsContainer.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.style.cssText);
        });
    
        this.#windowsContainer.addEventListener('dragend', (event) => {
            event.target.style.left = `${event.pageX -  75}px`;
            event.target.style.top = `${event.pageY -  75}px`;
        });
    }

    oerderTheWindows() {
        var z = 0
        var offset = 10
        var top = 0
        var left = 0
        var start = 0
        const maxWidht  = 1130 //the Viewport width 1372//
        var x = 0
        const w = document.querySelectorAll('.windowsContainer')
    
        if ( w.length === 0) {
            return
        }
    
        for (let i = 0; i <  w.length;i ++) {
            if ((left + x* offset) > maxWidht) {
                top = 20
                left = 0
                x = 0
            }
            
            if (z === 56) {
                left += x* offset
                x = 0 
                top = 0
                z = 0
            } else {
                z++
            }
            w[i].style.top = `${top + x * offset}px`
            w[i].style.left = `${left + x* offset}px`
            w[i].style.zedIndex = z
            x++
        }
        
        console.log('zz', z)
    }

}