/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? <MDXLayout {...props}><_createMdxContent /></MDXLayout> : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1",
      p: "p"
    }, props.components), {Image} = _components;
    if (!Image) _missingMdxReference("Image", true);
    return <><_components.h1>{"Heading"}</_components.h1>{"\n"}<_components.p>{"Text"}</_components.p>{"\n"}<_components.p><Image src={{
      src: "/assets/images/image-public-directory.47a40b59.png",
      width: 300,
      height: 300
    }} alt="alt" title="title" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAV0lEQVQImWMwZmDAimAsRkYEiSxhBEaGYBIhYcTAYCcoaM3DYy8kZMnJCZGDylvz8Fhxcdnw8ZmzsaFIYDcKYq0JDEGcgHCfGQuLJSenBQeHBQeHGRsbAHL1DiaVYxM5AAAAAElFTkSuQmCC" /></_components.p>{"\n"}<_components.p><Image src={{
      src: "/assets/images/image-public-directory.47a40b59.png",
      width: 300,
      height: 300
    }} alt="alt" title="title" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAV0lEQVQImWMwZmDAimAsRkYEiSxhBEaGYBIhYcTAYCcoaM3DYy8kZMnJCZGDylvz8Fhxcdnw8ZmzsaFIYDcKYq0JDEGcgHCfGQuLJSenBQeHBQeHGRsbAHL1DiaVYxM5AAAAAElFTkSuQmCC" /></_components.p>{"\n"}<_components.p><Image src={{
      src: "/assets/images/image-public-directory.47a40b59.png",
      width: 300,
      height: 300
    }} alt="alt" title="title" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAV0lEQVQImWMwZmDAimAsRkYEiSxhBEaGYBIhYcTAYCcoaM3DYy8kZMnJCZGDylvz8Fhxcdnw8ZmzsaFIYDcKYq0JDEGcgHCfGQuLJSenBQeHBQeHGRsbAHL1DiaVYxM5AAAAAElFTkSuQmCC" /></_components.p></>;
  }
}
export default MDXContent;
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
