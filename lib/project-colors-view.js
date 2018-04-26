'use babel'

export default class ProjectColorsView {
  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div')
    this.element.classList.add('my-package')

    // Create message element
    const message = document.createElement('div')
    message.textContent = 'The MyPackage package is Alive! It\'s ALIVE!';
    message.classList.add('message')
    this.element.appendChild(message)
  }

  serialize() {
    return {
      data: this.data
    }
  }

  destroy() {
    this.element.remove()
  }

  getElement() {
    return this.element
  }
}
