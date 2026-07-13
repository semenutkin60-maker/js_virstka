const rootSelector = '[data-js-video-player]'

class VideoPlayer {
    selectors = {
        root: rootSelector,
        video: '[data-js-video-player-video]',
        panel: '[data-js-video-player-panel]',
        playButton: '[data-js-video-player-button]', // ← исправлено!
    }

    stateClasses = {
        isActive: 'is-active',
    }

    constructor(rootElement) {
        this.rootElement = rootElement
        this.videoElement = this.rootElement.querySelector(this.selectors.video)
        this.panelElement = this.rootElement.querySelector(this.selectors.panel)
        this.playButtonElement = this.rootElement.querySelector(this.selectors.playButton)
        
        console.log('VideoPlayer initialized:', {
            video: this.videoElement,
            panel: this.panelElement,
            playButton: this.playButtonElement
        })
        
        this.bindEvents()
    }

    onPlayButtonClick = (event) => {
        console.log('Play button clicked!')
        event.preventDefault()
        
        if (this.videoElement) {
            // Проверяем, есть ли видео
            console.log('Video source:', this.videoElement.src)
            
            // Пробуем воспроизвести
            const playPromise = this.videoElement.play()
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video started playing!')
                    this.videoElement.controls = true
                    this.panelElement.classList.remove(this.stateClasses.isActive)
                }).catch(error => {
                    console.error('Playback error:', error)
                })
            }
        } else {
            console.error('Video element is null!')
        }
    }

    onVideoPause = () => {
        console.log('Video paused')
        this.videoElement.controls = false
        this.panelElement.classList.add(this.stateClasses.isActive)
    }

    bindEvents() {
        if (this.playButtonElement) {
            this.playButtonElement.addEventListener('click', this.onPlayButtonClick)
            console.log('Event listener added to play button')
        } else {
            console.error('Play button not found!')
        }
        
        if (this.videoElement) {
            this.videoElement.addEventListener('pause', this.onVideoPause)
            console.log('Event listener added to video')
        }
    }
}

class VideoPlayerCollection {
    constructor() {
        this.init()
    }

    init() {
        const elements = document.querySelectorAll(rootSelector)
        console.log('Found video players:', elements.length)
        
        elements.forEach((element, index) => {
            console.log(`Initializing player ${index}:`, element)
            new VideoPlayer(element)
        })
    }
}

export default VideoPlayerCollection