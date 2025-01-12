export const hexToRGB = (hex: string) => ({
  r: parseInt(hex.substring(1, 3), 16),
  g: parseInt(hex.substring(3, 5), 16),
  b: parseInt(hex.substring(5, 7), 16),
});

export const calculateBrightness = (red: number, green: number, blue: number) =>
  (red * 299 + green * 587 + blue * 114) / 1000;

export const getBackground = (colorHex: string) => {
  const minBlackRatio = 130;
  const RGB = hexToRGB(colorHex);
  return calculateBrightness(RGB.r, RGB.g, RGB.b) < minBlackRatio
    ? "white"
    : "black";
};

export const randomString = (length: number) =>
  [...Array(length)].map(() => Math.random().toString(36)[2]).join("");

export const debouncedMethod = <T, Args extends any[]>(
  callback: (...args: Args) => T,
  debounce: number = 500
) => {
  let timeoutID: ReturnType<typeof setTimeout> | null = null;
  return (...args: Args) =>
    new Promise<T>((res) => {
      if (timeoutID) {
        console.log("timeout exists!");
        clearTimeout(timeoutID);
      }
      console.log("creating timeout!");
      timeoutID = setTimeout(() => res(callback(...args)), debounce);
    });
};
