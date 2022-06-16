/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1",
      p: "p",
      img: "img"
    }, props.components), {Image} = _components;
    if (!Image) _missingMdxReference("Image", true);
    return <><_components.h1>{"Heading"}</_components.h1>{"\n"}<_components.p>{"Text"}</_components.p>{"\n"}<_components.p><_components.img src="https://example.com/image.png" alt="alt" title="title" /></_components.p>{"\n"}<_components.p><_components.img src="http://example.com/image.png" alt="alt" title="title" /></_components.p>{"\n"}<_components.p><_components.img src="ftp://example.com/image.png" alt="alt" title="title" /></_components.p>{"\n"}<_components.p><Image src={{
      src: "/_next/static/media/image.0a4b47fd.png",
      width: 200,
      height: 200
    }} alt="alt" title="title" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAZElEQVQImW3NTQqAIBCG4RndiH+oF0izhajh/W8XpoRF8MIsHvgGdoDf5omIoy/4uw0grBAAmjFV6+Zc5nzY9FPrDtYmxl7wTPl1KiIelM4IiYRExP4gc16VqlIWKYsQVanE2AXhbQqsHYnfbwAAAABJRU5ErkJggg==" /></_components.p>{"\n"}<_components.p><Image src={{
      src: "/_next/static/media/image.0a4b47fd.png",
      width: 200,
      height: 200
    }} alt="alt" title="title" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAZElEQVQImW3NTQqAIBCG4RndiH+oF0izhajh/W8XpoRF8MIsHvgGdoDf5omIoy/4uw0grBAAmjFV6+Zc5nzY9FPrDtYmxl7wTPl1KiIelM4IiYRExP4gc16VqlIWKYsQVanE2AXhbQqsHYnfbwAAAABJRU5ErkJggg==" /></_components.p>{"\n"}<_components.p><Image src={{
      src: "/_next/static/media/image.0a4b47fd.png",
      width: 200,
      height: 200
    }} alt="alt" title="title" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAZElEQVQImW3NTQqAIBCG4RndiH+oF0izhajh/W8XpoRF8MIsHvgGdoDf5omIoy/4uw0grBAAmjFV6+Zc5nzY9FPrDtYmxl7wTPl1KiIelM4IiYRExP4gc16VqlIWKYsQVanE2AXhbQqsHYnfbwAAAABJRU5ErkJggg==" /></_components.p></>;
  }
}
export default MDXContent;
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
