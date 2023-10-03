export default function path(strings: TemplateStringsArray) {
  return [Bun.main, ...strings].join("/");
}
