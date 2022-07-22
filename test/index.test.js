/* eslint-disable node/no-unpublished-import */

import { compile } from '@mdx-js/mdx'
import fs from 'node:fs/promises'
import { read } from 'to-vfile'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { matter } from 'vfile-matter'

import withNextImages from '../src/index.js'

test('does not transform urls', async () => {
  const fixture = await read('./test/fixtures/test.md')
  const result = await compile(fixture, { jsx: true, remarkPlugins: [withNextImages] })

  // await fs.writeFile('./test/fixtures/expected.jsx', String(result))
  const expected = await fs.readFile('./test/fixtures/expected.jsx', { encoding: 'utf-8' })
  assert.fixture(String(result), expected)

  assert.ok(await fs.stat('./public/image.0a4b47fd.png'))
})

test('does not transform urls', async () => {
  const fixture = await read('./test/fixtures/test-public-directory.md')
  const result = await compile(fixture, {
    jsx: true,
    remarkPlugins: [[withNextImages, { publicDirectory: '/assets/images' }]],
  })

  // await fs.writeFile('./test/fixtures/expected-public-directory.jsx', String(result))
  const expected = await fs.readFile('./test/fixtures/expected-public-directory.jsx', {
    encoding: 'utf-8',
  })
  assert.fixture(String(result), expected)

  assert.ok(await fs.stat('./public/assets/images/image-public-directory.47a40b59.png'))
})

test('transform frontmatter images and add data to vfile', async () => {
  const fixture = await read('./test/fixtures/test-additional.md')
  matter(fixture)
  const result = await compile(fixture, {
    jsx: true,
    remarkPlugins: [
      [
        withNextImages,
        {
          images(data) {
            return [{ key: 'featuredImage', filePath: data.matter.featuredImage }]
          },
        },
      ],
    ],
  })

  const expected = {
    src: '/image.0a4b47fd.png',
    width: 200,
    height: 200,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAZElEQVQImW3NTQqAIBCG4RndiH+oF0izhajh/W8XpoRF8MIsHvgGdoDf5omIoy/4uw0grBAAmjFV6+Zc5nzY9FPrDtYmxl7wTPl1KiIelM4IiYRExP4gc16VqlIWKYsQVanE2AXhbQqsHYnfbwAAAABJRU5ErkJggg==',
  }
  assert.equal(result.data.images['featuredImage'], expected)

  assert.ok(await fs.stat('./public/image.0a4b47fd.png'))
})

test.run()
