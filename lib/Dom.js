export default class Dom {
  constructor() {
    this.colorsTry = []
    this.previousCombinationToFind = null
    this.activeEntry = null
  }

  loadGameOver(combinationToFind) {
    const submitButton = document.querySelector('.add-try-button')
    const boardElement = document.querySelector('.board')
    const restartContentElement = document.querySelector('.restart-content')
    const titleElements = restartContentElement.querySelectorAll('h3')
    const colorsElements = restartContentElement.querySelectorAll('.colors')
    const restartButton = restartContentElement.querySelector('.restart-button')

    if (this.previousCombinationToFind !== combinationToFind) {
      if (
        this.previousCombinationToFind ||
        titleElements[0]?.innerText.includes('Bravo')
      ) {
        for (const title of titleElements) {
          title.remove()
        }

        for (const colors of colorsElements) {
          colors.remove()
        }
      }

      const ulColors = document.createElement('ul')
      ulColors.classList.add('colors')

      for (const color of combinationToFind) {
        const liColor = document.createElement('li')
        liColor.classList.add('color')
        liColor.style.backgroundColor = color

        ulColors.appendChild(liColor)
      }

      const h3Title = document.createElement('h3')
      h3Title.innerText = 'La combinaison à trouver était :'

      restartContentElement.insertBefore(h3Title, restartButton)
      restartContentElement.insertBefore(ulColors, restartButton)

      submitButton.disabled = true
      boardElement.classList.add('restart')
    }

    this.previousCombinationToFind = combinationToFind
  }

  loadWin() {
    const submitButton = document.querySelector('.add-try-button')
    const boardElement = document.querySelector('.board')
    const restartContentElement = document.querySelector('.restart-content')
    const restartButton = restartContentElement.querySelector('.restart-button')
    const h3Element = restartContentElement.querySelector('h3')

    if (h3Element) {
      h3Element.remove()
    }

    const h3Title = document.createElement('h3')
    h3Title.innerText = 'Bravo, vous avez gagné !'

    restartContentElement.insertBefore(h3Title, restartButton)

    submitButton.disabled = true
    boardElement.classList.add('restart')
  }

  updateError(error) {
    const errorElement = document.querySelector('.error')
    if (error) {
      errorElement.classList.add('show')
    } else {
      errorElement.classList.remove('show')
    }
    errorElement.innerText = error
  }

  clearTrials() {
    const trialsElement = document.querySelector('.trials')

    trialsElement.innerHTML = ''
  }

  updaterRemainingTrials(remainingTrials) {
    const remainingTrialsElement = document.querySelector('.remaining-trials')

    remainingTrialsElement.innerText = `${remainingTrials} essai${
      remainingTrials > 1 ? 's' : ''
    } restant${remainingTrials > 1 ? 's' : ''}.`
  }

  reload() {
    const submitButton = document.querySelector('.add-try-button')
    const boardElement = document.querySelector('.board')
    const colorsElement = document.querySelector('.restart-content .colors')

    if (colorsElement) {
      colorsElement.innerHTML = ''
    }

    submitButton.disabled = false
    boardElement.classList.remove('restart')
    this.clearTrials()
  }

  loadColorList(colors) {
    const colorListElement = document.querySelector('.color-list')
    const colorsElement = colorListElement.querySelector('.colors')

    let i = 1

    for (const color of colors) {
      const liColor = document.createElement('li')
      liColor.draggable = true
      liColor.classList.add('color')
      liColor.style.backgroundColor = colors[i - 1]

      if (window.innerWidth > 1024) {
        liColor.addEventListener('dragstart', () => {
          liColor.classList.add('dragging')
        })

        liColor.addEventListener('dragend', () => {
          liColor.classList.remove('dragging')
        })
      } else {
        liColor.addEventListener('click', () => {
          this.activeEntry.style.backgroundColor = color
          const children = [...this.activeEntry.parentElement.childNodes]
          let i = 0

          for (const child of children) {
            if (child.classList.contains('active')) {
              break
            }
            i++
          }

          this.colorsTry[i] = color
        })
      }

      colorsElement.appendChild(liColor)
      i++
    }

    if (window.innerWidth < 1025) {
      const colorListHeight = colorListElement.getBoundingClientRect().height
      colorListElement.style.marginBottom = `calc(-${colorListHeight}px - 1.5rem)`

      window.addEventListener('resize', () => {
        if (!colorListElement.classList.contains('show')) {
          const colorListHeight =
            colorListElement.getBoundingClientRect().height
          colorListElement.style.marginBottom = `calc(-${colorListHeight}px - 1.5rem)`
        }
      })
    }
  }

  handleTheme() {
    const switchThemeButton = document.querySelector('.switch-theme')

    let theme = window.localStorage.getItem('mastermind-theme')

    if (theme) {
      document.body.className = theme
    } else {
      window.localStorage.setItem('mastermind-theme', 'light')
      document.body.className = 'light'
    }

    switchThemeButton.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem('mastermind-theme', theme)
      document.body.className = theme
    })
  }

  loadEntries(length) {
    const colorsElement = document.querySelector('.entry .colors')

    for (let i = 0; i < length; i++) {
      let activeColor

      const liColor = document.createElement('li')
      liColor.classList.add('color')

      if (window.innerWidth > 1024) {
        liColor.addEventListener('dragover', e => {
          e.preventDefault()
          const dragging = document.querySelector('.dragging')
          activeColor = dragging.style.backgroundColor
          liColor.style.borderColor = dragging.style.backgroundColor
          liColor.classList.add('dragover')
        })

        liColor.addEventListener('dragleave', () => {
          liColor.classList.remove('dragover')
          liColor.style.borderColor = null
        })

        liColor.addEventListener('drop', () => {
          this.colorsTry[i] = activeColor
          liColor.style.backgroundColor = activeColor
          liColor.classList.remove('dragover')
          liColor.style.borderColor = null
        })
      }

      colorsElement.appendChild(liColor)
    }

    if (window.innerWidth < 1025) {
      const colorListElement = document.querySelector('.color-list')

      document.addEventListener('click', e => {
        if (e.target.matches('.entry .color')) {
          for (const color of document.querySelectorAll('.entry .color')) {
            color.classList.remove('active')
          }
          colorListElement.style.marginBottom = 0
          colorListElement.classList.add('show')
          e.target.classList.add('active')
          this.activeEntry = e.target
        } else if (
          !e.target.closest('.entry') &&
          !e.target.closest('.color-list')
        ) {
          const colorListHeight =
            colorListElement.getBoundingClientRect().height
          colorListElement.style.marginBottom = `calc(-${colorListHeight}px - 1.5rem)`
          colorListElement.classList.remove('show')
        }
      })
    }
  }

  resetEntries() {
    const colorsElement = document.querySelector('.entry .colors')

    for (const child of colorsElement.children) {
      child.style.backgroundColor = ''
    }
  }

  addTry(id, colors, { wellPlaced, wrongPlaced }) {
    const trialsElement = document.querySelector('.trials')

    const liTry = document.createElement('li')
    liTry.classList.add('try')

    const spanId = document.createElement('span')
    spanId.classList.add('id')
    spanId.innerText = id

    const spanWellPlaced = document.createElement('span')
    spanWellPlaced.classList.add('well-placed')
    spanWellPlaced.innerText = wellPlaced

    const spanWrongPlaced = document.createElement('span')
    spanWrongPlaced.classList.add('wrong-placed')
    spanWrongPlaced.innerText = wrongPlaced

    const ulColors = document.createElement('ul')
    ulColors.classList.add('colors')

    for (const color of colors) {
      const liColor = document.createElement('li')
      liColor.classList.add('color')
      liColor.style.backgroundColor = color
      ulColors.appendChild(liColor)
    }

    liTry.appendChild(spanId)
    liTry.appendChild(ulColors)
    liTry.appendChild(spanWellPlaced)
    liTry.appendChild(spanWrongPlaced)
    trialsElement.appendChild(liTry)
    this.resetEntries()
  }
}
