import * as THREE from 'three/webgpu'

const text = `
██╗  ██╗██╗ █████╗ ███╗   ██╗                       
██║ ██╔╝██║██╔══██╗████╗  ██║                       
█████╔╝ ██║███████║██╔██╗ ██║                       
██╔═██╗ ██║██╔══██║██║╚██╗██║                       
██║  ██╗██║██║  ██║██║ ╚████║                       
╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝                       
                                                      
███████╗ █████╗ ██████╗  █████╗ ███╗   ██╗██████╗ ██╗
╚══███╔╝██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔══██╗██║
  ███╔╝ ███████║██████╔╝███████║██╔██╗ ██║██║  ██║██║
 ███╔╝  ██╔══██║██╔══██╗██╔══██║██║╚██╗██║██║  ██║██║
███████╗██║  ██║██║  ██║██║  ██║██║ ╚████║██████╔╝██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝

╔═ Intro ═══════════════╗
║ Thanks for peeking under the hood.
║ Zyrax Drive is Kian Zarandi's (@kianPk) portfolio.
║ Engine adapted from folio-2025 (MIT).
╚═══════════════════════╝

╔═ Socials ═══════════════╗
║ Mail     ⇒ kianzarandi701@gmail.com
║ Telegram ⇒ https://t.me/Kian_asli
║ GitHub   ⇒ https://github.com/kianPk
║ Web      ⇒ https://www.zyrax.ir
║ Playfield⇒ https://kianpk.github.io/playfield/
║ Orbit    ⇒ https://kianpk.github.io/orbit-desk/
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ Add #debug to the URL and reload.
║ Press [V] to toggle the free camera.
╚═══════════════════════╝

╔═ Three.js ════════════╗
║ Three.js powers this world (release: ${THREE.REVISION})
║ https://threejs.org/
╚═══════════════════════╝

╔═ Engine credit ═══════╗
║ folio-2025 engine (MIT) · Bruno Simon
║ Content & branding · Kian Zarandi
║ https://github.com/kianPk/zyrax-drive
╚═══════════════════════╝

╔═ Stack extras ════════╗
║ Rapier  ⇒ https://rapier.rs/
║ Howler  ⇒ https://howlerjs.com/
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]
