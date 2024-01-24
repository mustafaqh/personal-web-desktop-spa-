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
  constructor () {
    this.#windowsContainer = document.createElement('div')
    this.#windowsContainer.className = 'windowsContainer'
    this.#windowsContainer.draggable = 'true'
    this.#windowBar = document.createElement('div')
    this.#windowBar.className = 'WindowBar'

    this.#WindowsName = document.createElement('div')
    this.#WindowsName.className = 'widowsName'

    this.#WindowHeader = document.createElement('p')
    this.#WindowHeader.className = 'winowHeader'

    this.#minimizBtn = document.createElement('button')
    this.#minimizBtn.className = 'minmize'

    this.#closeBtn = document.createElement('button')
    this.#closeBtn.className = 'close'

    this.#minimizeIcon = document.createElement('img')
    const theMiniIcon = (new URL('../../img/mini.png', import.meta.url)).href
    this.#minimizeIcon.src = `${theMiniIcon}`
    this.#minimizeIcon.className = 'minimizeIcon'

    this.#closeIcon = document.createElement('img')
    const theCloseIcon = (new URL('../../img/close.png', import.meta.url)).href
    this.#closeIcon.src = `${theCloseIcon}`
    this.#closeIcon.className = 'closeIcon'
    this.#closeBtn.appendChild(this.#closeIcon)
    this.#minimizBtn.appendChild(this.#minimizeIcon)

    this.#WindowsName.appendChild(this.#WindowHeader)

    this.#windowBar.appendChild(this.#WindowsName)
    this.#windowBar.appendChild(this.#minimizBtn)
    this.#windowBar.appendChild(this.#closeBtn)

    this.#windowsContainer.appendChild(this.#windowBar)
    this.#widowZindex = 1
    this.minimizeWindow()
  }

  /**
   *
   * @returns {Element} DOM element that represent the window container.
   */
  returnWindow () {
    return this.#windowsContainer
  }

  /**
   *
   * @param {Element} element represent outer Dom element as parent for the window container.
   */
  appendWindow (element) {
    element.appendChild(this.#windowsContainer)
  }

  /**
   *
   * @param {Element} child represent Dom element as child for the window container.
   */
  appendWindowChild (child) {
    this.#windowsContainer.appendChild(child)
  }

  /**
   * function to addd event listener to mimization button.
   */
  minimizeWindow () {
    this.#minimizBtn.addEventListener('click', () => {
      this.#windowsContainer.classList.add('hidden')
    })
  }

  /**
   *
   * @returns {Element} Dom element that represent a closing button.
   */
  returnCloseButton () {
    return this.#closeBtn
  }

  /**
   * function to drag and drop the window(window container)
   */
  dragDrop () {
    this.#windowsContainer.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', event.target.style.cssText)
    })

    this.#windowsContainer.addEventListener('dragend', (event) => {
      event.target.style.left = `${event.pageX - 75}px`
      event.target.style.top = `${event.pageY - 75}px`
    })
  }

  /**
   *
   * function to get the opend window as the assigment demands
   */
  oerderTheWindows () {
    let z = 0
    const offset = 10
    let top = 0
    let left = 0
    const maxWidht = 1130 // the Viewport width 1372//
    let x = 0
    const w = document.querySelectorAll('.windowsContainer')

    if (w.length === 0) {
      return
    }

    for (let i = 0; i < w.length; i++) {
      if ((left + x * offset) > maxWidht) {
        top = 20
        left = 0
        x = 0
      }

      if (z === 56) {
        left += x * offset
        x = 0
        top = 0
        z = 0
      } else {
        z++
      }
      w[i].style.top = `${top + x * offset}px`
      w[i].style.left = `${left + x * offset}px`
      w[i].style.zedIndex = z
      x++
    }
  }
}
