import type { Plugin } from 'unified'
import type * as Mdast from 'mdast'

export interface Options {
  assetPrefix?: string
  publicDirectory?: string
}

declare const withNextImages: Plugin<[Options?], Mdast.Root>

export default withNextImages
