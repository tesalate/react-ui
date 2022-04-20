export const exampleFunction = (): number => {
  return 1;
};
export const numberWithCommas = (x: number) => {
  return x
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const toTitleCase = (str: string) => {
  // return [...str.split("")].map((w, i) => i === 0 ? w[0].toUpperCase() : w).join('')
  return str.replace(/\w\S*/g, (t) => {
    return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
  });
};

export const removeEmpty = (obj: Record<any, any>): Record<any, any> => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
};
