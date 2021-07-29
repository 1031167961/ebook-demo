export function pr(px) { // 将像素转换成rem
  const ratio = 375 / 10
  return px / ratio
}

export function realPx(px) { // 根据当前屏幕rem缩放比例，计算出真实px值
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
}
