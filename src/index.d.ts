import type { Plugin } from 'unified'
import type * as Mdast from 'mdast'
import type { Data } from 'vfile'

export interface Options {
  assetPrefix?: string
  images?: (data: Data) => Array<{ key: string; filePath: string }>
  /** @default 'Image' */
  name?: string
  publicDirectory?: string
}

declare const withNextImages: Plugin<[Options?], Mdast.Root>

export default withNextImages

declare module 'vfile' {
  interface DataMap {
    images: Record<
      string,
      /** import type { StaticImageData } from 'next/image' */
      { src: string; width: number; height: number; blurDataURL: string | undefined }
    >
  }
}
