import './style.css'
import { setupWatermark } from '../lib/main'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">btn</button>
      <button id="update" type="button">update</button>
      <button id="updateImg" type="button">img</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

let cnt = 0
let watermark = setupWatermark({
  content: 'watermark',
  // image: 'https://img.alicdn.com/imgextra/i2/O1CN01FF1t1g1Q3PDWpSm4b_!!6000000001920-55-tps-508-135.svg',
  imageOptions: {
    width: 100,
    height: 30
  },
  rotate: 320
})

document.getElementById('counter')!.onclick = () => {
  watermark.destory()
  watermark = setupWatermark({
    content: 'watermark123',
    // image: 'https://img.alicdn.com/imgextra/i2/O1CN01FF1t1g1Q3PDWpSm4b_!!6000000001920-55-tps-508-135.svg',
    imageOptions: {
      width: 100,
      height: 30
    },
    rotate: 320
  })
}

document.getElementById('update')!.onclick = () => {
  cnt++
  watermark.updateByText('abc - ' + cnt)
}

document.getElementById('updateImg')!.onclick = () => {
  watermark.updateByImage('https://img.alicdn.com/imgextra/i2/O1CN01FF1t1g1Q3PDWpSm4b_!!6000000001920-55-tps-508-135.svg')
}
