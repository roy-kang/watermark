# watermark-web.js
A library for setting watermarks on web pages. Support text, image rendering, and custom rendering.
The watermark cannot be deleted or changed.

# Installing
```
# install via npm
$ npm install watermark-web.js
```

# Usage
```ts
import setupWatermark from 'watermark-web.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id="update" type="button">update</button>
  </div>
`

// initial
let watermark = setupWatermark({
  content: 'watermark'
})

let cnt = 0
document.getElementById('update')!.onclick = () => {
  if (cnt & 1) {
    // update to text
    watermark.update({
      content: 'abc - ' + cnt
    })
  } else {
    // update to image
    watermark.update({
      image: 'https://img.alicdn.com/imgextra/i2/O1CN01FF1t1g1Q3PDWpSm4b_!!6000000001920-55-tps-508-135.svg'
    })
  }
}

// Watermark can be customized
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

// destory
watermark.destory()
```

# Props
```ts
type options = {
  // Insert the target element, default: body
  target?: HTMLElement
  // canvas insert type. It can only be in one element, default: fixed
  type?: 'absolute' | 'fixed'
  // Filled text (Must be selected one parameter in the content and image)
  content?: string
  // The maximum width of text drawn
  maxWidth?: number
  // Image path (Must be selected one parameter in the content and image)
  image?: string
  // Image drawing parameters
  imageOptions?: {
    // The width of the cropped image
    width?: number,
    // The height of the cropped image
    height?: number
  }
  // The text font to draw, default: 14px Arial
  font?: string
  // The color of the drawn text, default: rgba(0, 0, 0)
  foreColor?: string
  // Rotation Angle of a single watermark, default: 330
  rotate?: number
  // The X-axis spacing, default: 260
  axisX?: number
  // The Y-axis spacing, default: 150
  axisY?: number
  // Opacity of canvas, default: 0.1
  opacity?: number
  // Starting point of the X-axis, default: 20
  startX?: number
  // Starting point on the Y axis, default: 50
  startY?: number
  // Customize the fill method
  print?: ((ctx: CanvasRenderingContext2D, options: Options) => void) | null
}
```

# Returns
```ts
type Returns = {
  // Update the watermark
  update: (options: Options) => void

  // Watermark destruction
  destory: () => void
}
```