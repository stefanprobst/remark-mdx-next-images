/**
 * @typedef {object} Options
 * @property {string} [assetPrefix]
 * @property {string} [publicDirectory]
 * @property {(data: import('vfile').Data) => Array<{ key: string; filePath: string }>} [images]
 */

import { isAbsoluteUrl } from '@stefanprobst/is-absolute-url'
import assert from 'node:assert'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { visit } from 'unist-util-visit'

/** @type {import('unified').Plugin<[Options?], import('mdast').Root>} */
const withNextImages = function withNextImages(options) {
  const { assetPrefix = '', publicDirectory = '/', images } = options || {}

  return async function transformer(tree, vfile) {
    assert(vfile.path != null, 'Please provide a path to the input MDX file.')
    const _filePath = isAbsoluteUrl(vfile.path) ? fileURLToPath(vfile.path) : vfile.path
    const _directory = path.dirname(_filePath)
    const directory = path.isAbsolute(_directory) ? _directory : path.join(vfile.cwd, _directory)
    const additionalFilePaths = images != null ? images(vfile.data) : []
    assert(vfile.data.images == null, 'VFile data already has a `image` field.')
    vfile.data.images = {}

    async function generate(url) {
      const src = path.normalize(url)
      const srcFilePath = path.isAbsolute(src) ? src : path.join(directory, src)
      const extension = path.extname(srcFilePath).toLowerCase()

      const buffer = await fs.readFile(srcFilePath)
      const hash = crypto.createHash('md4')
      hash.update(buffer)

      const outputFilePath = path.join(
        publicDirectory,
        path.basename(srcFilePath).slice(0, -extension.length + 1) +
          hash.digest('hex').slice(0, 8) +
          extension,
      )

      const publicPath = path.join(assetPrefix, outputFilePath)
      const destinationFilePath = path.join(process.cwd(), 'public', outputFilePath)

      if (!(await fileExists(destinationFilePath))) {
        await fs.mkdir(path.dirname(destinationFilePath), { recursive: true })
        await fs.copyFile(srcFilePath, destinationFilePath)
      }

      const image = sharp(buffer)
      const { width, height, format } = await image.metadata()
      const blurDataUrl = format !== 'svg' ? await generateBlurDataUrl(image) : undefined

      return { src: publicPath, width, height, blurDataURL: blurDataUrl }
    }

    const promises = []

    for (const { key, filePath } of additionalFilePaths) {
      if (filePath != null && !isAbsoluteUrl(filePath)) {
        vfile.data.images[key] = await generate(filePath)
      }
    }

    visit(tree, 'image', (node, index, parent) => {
      assert(index != null)
      assert(parent != null)

      if (isAbsoluteUrl(node.url)) return

      async function replaceNode() {
        const { src, width, height, blurDataURL } = await generate(node.url)

        parent.children.splice(
          index,
          1,
          // @ts-expect-error TODO: figure out typings, use import('mdast-util-mdx')
          createMdxJsxTextElement({
            name: 'Image',
            attributes: [
              createMdxJsxAttribute({
                name: 'src',
                value: createMdxJsxAttributeValueExpression(
                  createObjectExpression([
                    createProperty(createIdentifier('src'), createLiteral(src)),
                    createProperty(createIdentifier('width'), createLiteral(width)),
                    createProperty(createIdentifier('height'), createLiteral(height)),
                  ]),
                ),
              }),
              createMdxJsxAttribute({ name: 'alt', value: node.alt }),
              createMdxJsxAttribute({ name: 'title', value: node.title }),
              createMdxJsxAttribute({ name: 'blurDataURL', value: blurDataURL }),
            ].filter(Boolean),
          }),
        )
      }

      promises.push(replaceNode())
    })

    await Promise.all(promises)
  }
}

export default withNextImages

function createMdxJsxTextElement({ name, attributes = [], children = [] }) {
  return {
    type: 'mdxJsxTextElement',
    name,
    children,
    attributes,
  }
}

function createMdxJsxAttribute({ name, value }) {
  if (value == null) return undefined

  return {
    type: 'mdxJsxAttribute',
    name,
    value,
  }
}

function createMdxJsxAttributeValueExpression(expression) {
  return {
    type: 'mdxJsxAttributeValueExpression',
    // value: expression.raw,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        comments: [],
        body: [
          {
            type: 'ExpressionStatement',
            expression,
          },
        ],
      },
    },
  }
}

function createLiteral(value) {
  return {
    type: 'Literal',
    value,
    // raw: String(value),
  }
}

function createObjectExpression(properties) {
  return {
    type: 'ObjectExpression',
    properties,
  }
}

function createProperty(key, value) {
  return {
    type: 'Property',
    method: false,
    shorthand: false,
    computed: false,
    key,
    value,
    kind: 'init',
  }
}

function createIdentifier(name) {
  return {
    type: 'Identifier',
    name,
  }
}

function generateBlurDataUrl(image) {
  const BLUR_IMG_SIZE = 8
  // const BLUR_QUALITY = 70

  return image
    .resize(BLUR_IMG_SIZE)
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      return `data:image/${info.format};base64,${data.toString('base64')}`
    })
}

async function fileExists(filePath) {
  try {
    await fs.stat(filePath)
    return true
  } catch {
    return false
  }
}
