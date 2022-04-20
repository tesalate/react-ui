const carTypeMap = new Proxy(
  {
    'MDLS|MS03|MS04': 'Model S',
    MDLX: 'Model X',
    MDL3: 'Model 3',
    MDLY: 'Model Y',
  },
  /* @ts-ignore */
  { get: (t, p) => Object.keys(t).reduce((r, v) => (r !== undefined ? r : new RegExp(v).test(p) ? t[v] : undefined), undefined) }
);

export default (option_codes: string) => {
  /* @ts-ignore */
  return carTypeMap[option_codes?.split(',').filter((el: string) => carTypeMap[el])[0]];
};
