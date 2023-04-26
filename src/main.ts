import './style.css'
import setupWatermark from '../lib/main'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">btn</button>
      <button id="update" type="button">update</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

let cnt = 0
let watermark = setupWatermark({
  content: 'watermark',
  print(ctx, option) {
    if (cnt++ & 1) {
      ctx.fillStyle = 'red'
    } else {
      ctx.fillStyle = 'blue'
    }
    ctx.fillText(option.content!, 0, 0)
  }
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
    foreColor: 'green',
    rotate: 320
  })
}

document.getElementById('update')!.onclick = () => {
  cnt++
  if (cnt & 1) {
    watermark.update({
      content: 'abc - ' + cnt
    })
  } else {
    watermark.update({
      image: 'https://img.alicdn.com/imgextra/i2/O1CN01FF1t1g1Q3PDWpSm4b_!!6000000001920-55-tps-508-135.svg'
    })
  }
}
