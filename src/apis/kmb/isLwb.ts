const LWB_ROUTES = [
  'A31',
  'A32',
  'A33',
  'A33X',
  'A34',
  'A36',
  'A37',
  'A38',
  'A41',
  'A41P',
  'A43',
  'A43P',
  'A47X',
  'E31',
  'E32',
  'E32A',
  'E33',
  'E33P',
  'E36',
  'E36A',
  'E36P',
  'E36S',
  'E37',
  'E37C',
  'E41',
  'E42',
  'E42C',
  'E42P',
  'E43',
  'NA31',
  'NA32',
  'NA33',
  'NA36',
  'NA37',
  'NA40',
  'NA41',
  'NA43',
  'NA47',
  'N30',
  'N31',
  'N42',
  'N42A',
  'N64',
  'S1',
  'S64',
  'S64C',
  'S64P',
  'S64X',
  'R8',
]

export function isLwb(routeName: string): boolean {
  return LWB_ROUTES.includes(routeName)
}
