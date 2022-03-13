export function hexToRGB(h) {
  let r = "0x" + h[1] + h[2];
  let g = "0x" + h[3] + h[4];
  let b = "0x" + h[5] + h[6];
  
  return `rgb(${++r}, ${++g}, ${++b})`
}
