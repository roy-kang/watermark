import ResizeObserver from 'resize-observer-polyfill'
import { throttle } from 'lodash-es'

type RequiredGroup<T, M extends keyof T, N extends keyof T> =
  {
    [P in M]-?: T[P]
  } & {
    [P in keyof Exclude<T, M>]?: P extends keyof T ? T[P] : never
  } |
  {
    [P in N]-?: T[P]
  } & {
    [P in keyof Exclude<T, N>]?: P extends keyof T ? T[P] : never
  }

type PartialGroup<T, M extends keyof T, N extends keyof T> =
  {
    [P in M]?: T[P]
  } & {
    [P in keyof Exclude<T, M>]-?: P extends keyof T ? T[P] : never
  } |
  {
    [P in N]?: T[P]
  } & {
    [P in keyof Exclude<T, N>]-?: P extends keyof T ? T[P] : never
  }

export type Options = RequiredGroup<{
  // 插入目标元素，默认 body
  target?: HTMLElement
  // canvas插入类型
  type?: 'absolute' | 'fixed'
  // 绘制文本
  content?: string
  // 文本绘制的最大宽度
  maxWidth?: number
  // 图片
  image?: string
  // 图片绘制的参数
  imageOptions?: {
    // 被剪切图像的宽度
    width?: number,
    // 被剪切图像的高度
    height?: number
  }
  // 绘制的文本字体
  font?: string
  // 绘制的文本颜色
  foreColor?: string
  // 单个水印的旋转角度
  rotate?: number
  // X 轴的间距
  axisX?: number
  // Y 轴的间距
  axisY?: number
  // 画布透明度
  opacity?: number
  // X 轴起始点
  startX?: number
  // Y 轴起始点
  startY?: number
  // 自定义填充方法
  print?: ((ctx: CanvasRenderingContext2D, option: Options) => void) | null
}, 'content', 'image'>

type InnerProps = {
  width: number
  height: number
}

const imgMap = new Map<string, HTMLImageElement>()

const defaultProps: Required<Omit<Options, 'content' | 'image'>> = {
  target: document.body,
  type: 'fixed',
  maxWidth: -1,
  imageOptions: {},
  font: '14px Arial',
  foreColor: 'rgba(0, 0, 0)',
  rotate: 330,
  axisX: 260,
  axisY: 150,
  opacity: 0.1,
  startX: 20,
  startY: 50,
  print: null
}

/**
 * 创建 canvas 元素
 * @param parentElement 父级元素
 * @param options canvas元素的配置
 * @returns canvas
 */
const createCanvas = (parentElement: HTMLElement, options: InnerProps & { opacity: number, type: 'absolute' | 'fixed' }) => {
  const { width, height, opacity, type } = options

  if (type === 'absolute') {
    const parentElementPosition = getComputedStyle(parentElement).getPropertyValue('position')
    if (parentElementPosition === 'static') {
      parentElement.setAttribute('style', 'position: relative;')
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.setAttribute('style', `position: ${type}; left: 0; top: 0; z-index: 2147483647; pointer-events: none; opacity: ${opacity};`)

  parentElement.appendChild(canvas)

  return canvas
}

/**
 * 绘制文字或者图片
 * @param ctx canvas 2d 实例
 * @param options 配置
 * @param img 图片
 */
const printImageOrText = (ctx: CanvasRenderingContext2D, options: Required<Options> & InnerProps, img?: HTMLImageElement) => {
  const { width, height, content, foreColor, rotate, axisX, axisY, startX, startY, maxWidth, imageOptions, print } = options

  const angle = Math.PI / 180 * rotate

  for (let x = startX; x < width + axisX; x += axisX) {
    for (let y = startY; y < height + axisY; y += axisY) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = foreColor
      if (print) {
        print(ctx, options)
      } else {
        if (content) {
          ctx.fillText(content, 0, 0, maxWidth < 0 ? undefined : maxWidth)
        } else if (img) {
          ctx.drawImage(img, 0, 0, imageOptions.width ?? img.width, imageOptions.height ?? img.height)
        }
      }
      ctx.restore()
    }
  }
}

/**
 * 绘制canvas
 * @param canvas canvas 元素
 * @param parentElement 父级元素
 * @param options canvas 配置
 * @returns MutationObserver
 */
const printCanvas = (canvas: HTMLCanvasElement, parentElement: HTMLElement, options: Required<Options> & InnerProps) => {
  const { image, font, foreColor } = options
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  ctx.fillStyle = foreColor

  let img: HTMLImageElement
  if (image) {
    if (imgMap.has(image)) {
      printImageOrText(ctx, options, imgMap.get(image))
    } else {
      img = new Image()
      img.src = image
      img.onload = () => {
        printImageOrText(ctx, options, img)
        imgMap.set(image, img)
      }
    }
  } else {
    ctx.font = font
    printImageOrText(ctx, options)
  }

  const observer = new MutationObserver(() => {
    parentElement.removeChild(canvas)
  })
  observer.observe(canvas, {
    attributes: true
  })
  return observer
}

/**
 * 更新canvas
 * @param canvas canvas 实例
 * @param target 挂载目标元素
 * @param options 配置属性
 * @param canvasObserver canvas 2d 实例
 * @returns 
 */
const updateCanvas = (
  canvas: HTMLCanvasElement,
  target: HTMLElement,
  options: PartialGroup<Options, 'content', 'image'> & InnerProps,
  canvasObserver?: MutationObserver
) => {
  canvasObserver?.disconnect()

  canvas.width = target.offsetWidth
  canvas.height = target.offsetHeight

  options.width = target.offsetWidth
  options.height = target.offsetHeight

  return printCanvas(canvas, target, options)
}

/**
 * 启动水印功能
 * @param options 配置属性
 */
export default function setupWatermark(options: Options) {
  const target = options.target || document.body
  let peWidth = window.innerWidth
  let peHeight = window.innerHeight

  if (options.type === 'absolute') {
    peWidth = target.offsetWidth
    peHeight = target.offsetHeight
  }

  const actualOptions = Object.assign({}, defaultProps, options) as PartialGroup<Options, 'content', 'image'>

  const allProps = {
    ...actualOptions,
    width: peWidth,
    height: peHeight
  }

  let canvas: HTMLCanvasElement | null = createCanvas(target, { width: peWidth, height: peHeight, opacity: allProps.opacity, type: allProps.type })

  let canvasObserver: MutationObserver | undefined

  const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (!mutation.target.contains(canvas)) {
          canvas = createCanvas(target, { width: peWidth, height: peHeight, opacity: allProps.opacity, type: allProps.type })
        }
      }
    }
  })
  observer.observe(target, {
    childList: true
  })

  const robserver = new ResizeObserver(throttle(() => {
    if (canvas) {
      canvasObserver = updateCanvas(canvas, target, allProps, canvasObserver)
    }
  }, 100))
  robserver.observe(target)

  return {
    update(updateOptions: Options) {
      if (canvas && updateOptions) {
        allProps.content = ''
        allProps.image = ''
        Object.assign(allProps, updateOptions)
        canvasObserver = updateCanvas(canvas, target, allProps, canvasObserver)
      }
    },
    destory() {
      if (canvas) {
        observer.disconnect()
        robserver.disconnect()
        canvasObserver?.disconnect()
        target.removeChild(canvas)
        canvas = null
      }
    }
  }
}
