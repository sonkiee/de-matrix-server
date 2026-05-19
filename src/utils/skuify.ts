export const skuify = ({
  brand,
  title,
  storage,
  color,
}: {
  brand?: string | null;
  title: string;
  storage?: string | null | number;
  color?: string | null;
}) => {
  const clean = (s: string) =>
    s
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, "")
      .trim();

  const brandCode = brand ? clean(brand).slice(0, 3) : "GEN";

  const titleCode = clean(title)
    .split(" ")
    .map((w) => w.slice(0, 2))
    .join("")
    .slice(0, 6);

  const storageCode = storage
    ? clean(String(storage)).replace(/\s+/g, "")
    : "STD";

  const colorCode = color ? clean(color).slice(0, 3) : "DEF";

  return [brandCode, titleCode, storageCode, colorCode].join("-");
};
