const rootSelector = '[data-js-tabs]'

class Tabs {
    selectors = {
        root: rootSelector,
        button: '[data-js-tab-button]',
        content: '[data-js-tabs-content]',
    }

    stateClasses = {
        isActive: 'is-active',
    }

    stateAttributes = {
        ariaSelected: 'aria-selected',
        tabIndex: 'tabindex',
    }

    constructor(rootElement) {
        this.rootElement = rootElement
        this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content)
        
        // Находим индекс активной кнопки
        let activeIndex = [...this.buttonElements].findIndex((buttonElement) => 
            buttonElement.classList.contains(this.stateClasses.isActive)
        )
        
        // Если нет активной кнопки, делаем первую активной
        if (activeIndex === -1 && this.buttonElements.length > 0) {
            activeIndex = 0
        }
        
        this.state = {
            activeTabIndex: activeIndex
        }
        
        this.limitTabsIndex = this.buttonElements.length - 1
        this.bindEvents()
        this.updateUI() // 👈 Обновляем UI при инициализации
    }

    getProxyState(initialState) {
        return new Proxy(initialState, {
            get: (target, prop) => {
                return (target[prop])
            },
            set: (target, prop, value) => {
                target[prop] = value

                this.updateUI()

                return true
            },
        })
    }

    updateUI() {
        const { activeTabIndex } = this.state

        // Обновляем кнопки
        this.buttonElements.forEach((buttonElement, index) => {
            const isActive = index === activeTabIndex

            buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
            buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString())
            buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')
        })

        // Обновляем контент
        this.contentElements.forEach((contentElement, index) => {
            const isActive = index === activeTabIndex

            contentElement.classList.toggle(this.stateClasses.isActive, isActive)
        })
    }

    activateTub(newTabIndex) {
        this.state.activeTabIndex = newTabIndex
        this.buttonElements[newTabIndex].focus()
    }

    previosTab = () => {
        const newTabIndex = this.state.activeTabIndex === 0
        ? TouchList.limitTabsIndex
        : this.state.activeTabIndex - 1

        this.activateTub(newTabIndex)
    }

    nextTub = () => {
        const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1

        this.activateTub(newTabIndex)
    }

    firstTub = () => {
        this.activateTub(0)
    }

    lastTub = () => {
        this.activateTub(this.limitTabsIndex)
    }

    onButtonClick(buttonIndex) {
        this.state.activeTabIndex = buttonIndex
        this.updateUI()
    }

    onKeyDown = (event) => {
        const { code, meyaKey } = event

        const action = {
            ArrowLeft: this.previousTab,
            ArrowRight: this.nextTub,
            Home: this.firstTub,
            End: this.lastTub,
        }[code]

        const isMacHomeKey = metaKey && code === 'ArrowLeft'
        if (isMacHomeKey) {
            this.firstTub()
            return
        }

        const isMacEndKey = metaKey && code === 'ArrowRight'
        if (isMacHomeKey) {
            this.lastTub()
            return
        }

        action?.()
    }

    bindEvents() {
        this.buttonElements.forEach((buttonElement, index) => {
            buttonElement.addEventListener('click', () => this.onButtonClick(index))
        })
        this.rootElement.addEventListener('keydown', this.onKeyDown)
    }
}

class TabsCollection {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Tabs(element)
        })
    }
}

export default TabsCollection