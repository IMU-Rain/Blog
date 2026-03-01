/**
 * 将颜色转换为 rgba 格式
 * @param color 支持 #rgb | #rrggbb | rgb() | rgba()
 * @param alpha 透明度，默认 1
 */
export function colorToRgba(color: string, alpha: number = 1): string {
  // 已经是 rgba
  if (color.startsWith("rgba")) {
    return color;
  }

  // rgb → rgba
  if (color.startsWith("rgb")) {
    return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }

  // #rgb 或 #rrggbb
  if (color.startsWith("#")) {
    let hex = color.slice(1);

    // #rgb → #rrggbb
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // 兜底
  return color;
}