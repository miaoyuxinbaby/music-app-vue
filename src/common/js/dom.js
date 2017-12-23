export function customDataAPI (el, key, value) {
  const prefix = 'data-'
  if (value) return el.setAttribute(prefix + key, value)
  return el.getAttribute(prefix + key)
}
