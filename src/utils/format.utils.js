export function formatValue(str) {
  // const str = "US,NT,-113.0254kg";
  if (typeof str === "undefined") return;
  const res = str
    .replace("US", "")
    .replace("NT", "")
    .replace("kg", "")
    .replace(/,/g, "");

  return Math.abs(res);
}
