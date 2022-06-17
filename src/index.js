/**
 * @typedef {object} Options
 * @property {string} [assetPrefix]
 */

import { isAbsoluteUrl } from '@stefanprobst/is-absolute-url'
import assert from 'node:assert'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { visit } from 'unist-util-visit'

/** @type {import('unified').Plugin<[Options], import('mdast').Root>} */
const withNextImages = function withNextImages(options) {
  const { assetPrefix = '' } = options || {}

  return async function transformer(tree, vfile) {
    assert(vfile.path != null, 'Please provide a path to the input MDX file.')
    const _filePath = isAbsoluteUrl(vfile.path) ? fileURLToPath(vfile.path) : vfile.path
    const _directory = path.dirname(_filePath)
    const directory = path.isAbsolute(_directory) ? _directory : path.join(vfile.cwd, _directory)

    const promises = []

    visit(tree, 'image', (node, index, parent) => {
      assert(index != null)
      assert(parent != null)

      if (isAbsoluteUrl(node.url)) return

      async function generate() {
        const src = path.normalize(node.url)
        const srcFilePath = path.isAbsolute(src) ? src : path.join(directory, src)
        const extension = path.extname(srcFilePath).toLowerCase()

        const buffer = await fs.readFile(srcFilePath)
        const hash = crypto.createHash('md4')
        hash.update(buffer)

        /**
         * @see https://github.com/vercel/next.js/blob/a4abc1e77dd05ae2ac172858e4b9fb82af5294f3/packages/next/build/webpack/loaders/next-image-loader.js#L14-L18
         *
         * @see https://github.com/vercel/next.js/blob/a4abc1e77dd05ae2ac172858e4b9fb82af5294f3/packages/next/server/image-optimizer.ts#L157-L159
         * @see https://github.com/vercel/next.js/blob/a4abc1e77dd05ae2ac172858e4b9fb82af5294f3/packages/next/server/image-optimizer.ts#L575-L580
         */
        const outputFilePath = path.join(
          'static',
          'media',
          path.basename(srcFilePath).slice(0, -extension.length + 1) +
            hash.digest('hex').slice(0, 8) +
            extension,
        )

        const publicPath = path.join(assetPrefix, '/_next', outputFilePath)
        const destinationFilePath = path.join(process.cwd(), '.next', outputFilePath)

        if (!(await fileExists(destinationFilePath))) {
          await fs.mkdir(path.dirname(destinationFilePath), { recursive: true })
          await fs.copyFile(srcFilePath, destinationFilePath)
        }

        const image = sharp(buffer)
        const { width, height, format } = await image.metadata()
        const blurDataUrl = format !== 'svg' ? await generateBlurDataUrl(image) : undefined

        parent.children.splice(
          index,
          1,
          // @ts-expect-error TODO: figure out typings
          createMdxJsxTextElement({
            name: 'Image',
            attributes: [
              // createMdxJsxAttribute({ name: 'src', value: publicPath }),
              // createMdxJsxAttribute({
              //   name: 'width',
              //   value: createMdxJsxAttributeValueExpression(createLiteral(width)),
              // }),
              // createMdxJsxAttribute({
              //   name: 'height',
              //   value: createMdxJsxAttributeValueExpression(createLiteral(height)),
              // }),
              createMdxJsxAttribute({
                name: 'src',
                value: createMdxJsxAttributeValueExpression(
                  createObjectExpression([
                    createProperty(createIdentifier('src'), createLiteral(publicPath)),
                    createProperty(createIdentifier('width'), createLiteral(width)),
                    createProperty(createIdentifier('height'), createLiteral(height)),
                  ]),
                ),
              }),
              createMdxJsxAttribute({ name: 'alt', value: node.alt }),
              createMdxJsxAttribute({ name: 'title', value: node.title }),
              createMdxJsxAttribute({ name: 'blurDataURL', value: blurDataUrl }),
            ].filter(Boolean),
          }),
        )
      }

      promises.push(generate())
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
