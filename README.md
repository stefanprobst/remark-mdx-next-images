# `remark-mdx-next-images`

This is a [`remark`](https://github.com/remarkjs/remark) plugin to transform local Markdown images
into [`next/image` components](https://nextjs.org/docs/api-reference/next/image).

It basically does what
[`next-image-loader`](https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack/loaders/next-image-loader.js)
does, but outside of Webpack.

The following Markdown images

```md
Will be transformed: ![local example image](./images/image.png 'local example')

Will _not_ be transformed: ![remote example image](https://example.com/image.png 'remote example')
```

are converted to

```jsx
<Image src={{ src: "/_next/static/media/image.12345678.png", width: 200, height: 200 }} alt="local example image" title="local example" />

<img src="https://example.com/image.png" alt="remote example image" title="remote example" />
```

## How to install

```bash
npm i @stefanprobst/remark-mdx-next-images sharp
```

## How to use

Add the plugin to the MDX processor, and make sure to pass in both file path (`path`) and file
content (`value`) (see [`vfile`](https://github.com/vfile/vfile)). For further details on how to
render MDX with Next.js, please see [the offical guide](https://mdxjs.com/guides/mdx-on-demand/).

```js
// ./pages.js

import { compile, run } from '@mdx-js/mdx'
import withNextImages from '@stefanprobst/remark-mdx-next-images'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import * as runtime from 'react/jsx-runtime'

const markdown = `
Look at *this*!
![local example image](../assets/image.png)
`

export async function getStaticProps() {
  const result = await compile(
    {
      // Usually, you would pass in the path to the local MDX file here.
      path: import.meta.url,
      value: markdown,
    },
    { outputFormat: 'function-body', remarkPlugins: [withNextImages] },
  )

  return {
    props: {
      code: String(result),
      data: result.data,
    },
  }
}

export default function Page(props) {
  const { code, data } = props

  const { default: Content, ...exported } = useMdx(code)

  return (
    <main>
      <Content components={{ Image }} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(exported, null, 2)}</pre>
    </main>
  )
}

function useMdx(code) {
  const [mdxModule, setMdxModule] = useState({ default: () => null })

  useEffect(() => {
    run(code, runtime).then(setMdxModule)
  }, [code])

  return mdxModule
}

// function useMdxSync(code) {
//   const mdxModule = useMemo(() => {
//     return runSync(code, runtime);
//   }, [code]);

//   return mdxModule;
// }
```

Additional props for `next/image`, like
[`placeholder`](https://nextjs.org/docs/api-reference/next/image#placeholder) can be set by passing
a custom `Image` component via `components`:

```js
export default function Page(props) {
  const { default: Content } = useMdx(props.code)
  return <Content components={{ Image: CustomImage }} />
}

function CustomImage(props) {
  return <Image {...props} placeholder="blur" />
}
```

## Options

- `assetPrefix` (optional): same as
  [Next.js `assetPrefix`](https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix)
