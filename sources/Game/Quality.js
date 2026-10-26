import { Events } from './Events.js'
import { Game } from './Game.js'

export class Quality
{
    constructor()
    {
        this.game = Game.getInstance()

        this.events = new Events()

        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        const saveData = !!(navigator.connection && navigator.connection.saveData)
        const lowMem = !!(navigator.deviceMemory && navigator.deviceMemory <= 4)
        const smallScreen = window.innerWidth < 900
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches

        this.isMobile = isMobile || coarsePointer
        // Low-power mode: phones / weak devices — skip bloom, shadows, heavy FX
        this.isLowPower = this.isMobile || saveData || lowMem || smallScreen

        // 0 = highest quality, 1 = light (default on phones)
        this.level = this.isLowPower ? 1 : 0

        // Debug
        if(this.game.debug.active)
        {
            const debugPanel = this.game.debug.panel.addFolder({
                title: '⚙️ Quality',
                expanded: false,
            })

            this.game.debug.addButtons(
                debugPanel,
                {
                    low: () =>
                    {
                        this.changeLevel(1)
                    },
                    high: () =>
                    {
                        this.changeLevel(0)
                    },
                },
                'change'
            )
        }
    }

    changeLevel(level = 0)
    {
        // Same
        if(level === this.level)
            return
            
        this.level = level
        this.events.trigger('change', [ this.level ])
    }
}
