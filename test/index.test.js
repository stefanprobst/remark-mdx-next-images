/* eslint-disable node/no-unpublished-import */

import { compile } from '@mdx-js/mdx'
import fs from 'node:fs/promises'
import { read } from 'to-vfile'
import { test } from 'uvu'
import * as assert from 'uvu/assert'

import withNextImages from '../src/index.js'

test('does not transform urls', async () => {
  const fixture = await read('./test/fixtures/test.md')
  const result = await compile(fixture, { jsx: true, remarkPlugins: [withNextImages] })

  // await fs.writeFile('./test/fixtures/expected.jsx', String(result))
  const expected = await fs.readFile('./test/fixtures/expected.jsx', { encoding: 'utf-8' })
  assert.fixture(String(result), expected)

  assert.ok(await fs.stat('./.next/static/media/image.0a4b47fd.png'))
})

test.run()
