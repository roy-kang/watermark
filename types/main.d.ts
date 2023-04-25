type RequiredGroup<T, M extends keyof T, N extends keyof T> = {
    [P in M]-?: T[P];
} & {
    [P in keyof Exclude<T, M>]?: P extends keyof T ? T[P] : never;
} | {
    [P in N]-?: T[P];
} & {
    [P in keyof Exclude<T, N>]?: P extends keyof T ? T[P] : never;
};
export type Options = RequiredGroup<{
    target?: HTMLElement;
    type?: 'absolute' | 'fixed';
    content: string;
    maxWidth?: number;
    image?: string;
    imageOptions?: {
        width?: number;
        height?: number;
    };
    font?: string;
    foreColor?: string;
    rotate?: number;
    axisX?: number;
    axisY?: number;
    opacity?: number;
    startX?: number;
    startY?: number;
    print?: ((ctx: CanvasRenderingContext2D) => void) | null;
}, 'content', 'image'>;
/**
 * 启动水印功能
 * @param options 配置属性
 */
export declare function setupWatermark(options: Options): {
    updateByText(content: string): void;
    updateByImage(image: string): void;
    destory(): void;
};
export {};
