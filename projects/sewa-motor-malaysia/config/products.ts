export interface Product {
  id: string
  nameKey: string
  descKey: string
  priceDaily: string
  priceWeekly: string
  priceMonthly: string
  priceDailyNum: number
  priceWeeklyNum: number
  priceMonthlyNum: number
  badge?: string
  highlight?: boolean
}

export const products: Product[] = [
  {
    id: 'honda-vario-160',
    nameKey: 'products.hondaVario160.name',
    descKey: 'products.hondaVario160.description',
    priceDaily: 'RM50',
    priceWeekly: 'RM280',
    priceMonthly: 'RM900',
    priceDailyNum: 50,
    priceWeeklyNum: 280,
    priceMonthlyNum: 900,
    badge: 'badgeMostPopular',
    highlight: true,
  },
  {
    id: 'yamaha-nmax-155',
    nameKey: 'products.yamahaNMax155.name',
    descKey: 'products.yamahaNMax155.description',
    priceDaily: 'RM55',
    priceWeekly: 'RM310',
    priceMonthly: 'RM1,000',
    priceDailyNum: 55,
    priceWeeklyNum: 310,
    priceMonthlyNum: 1000,
  },
  {
    id: 'honda-pcx-160',
    nameKey: 'products.hondaPCX160.name',
    descKey: 'products.hondaPCX160.description',
    priceDaily: 'RM60',
    priceWeekly: 'RM340',
    priceMonthly: 'RM1,100',
    priceDailyNum: 60,
    priceWeeklyNum: 340,
    priceMonthlyNum: 1100,
    badge: 'badgeBestValue',
  },
  {
    id: 'honda-wave-125',
    nameKey: 'products.hondaWave125.name',
    descKey: 'products.hondaWave125.description',
    priceDaily: 'RM35',
    priceWeekly: 'RM200',
    priceMonthly: 'RM650',
    priceDailyNum: 35,
    priceWeeklyNum: 200,
    priceMonthlyNum: 650,
    badge: 'badgeBudgetPick',
  },
  {
    id: 'yamaha-y15zr',
    nameKey: 'products.yamahaY15ZR.name',
    descKey: 'products.yamahaY15ZR.description',
    priceDaily: 'RM40',
    priceWeekly: 'RM230',
    priceMonthly: 'RM750',
    priceDailyNum: 40,
    priceWeeklyNum: 230,
    priceMonthlyNum: 750,
  },
  {
    id: 'modenas-kriss-mr3',
    nameKey: 'products.modenasKrissMR3.name',
    descKey: 'products.modenasKrissMR3.description',
    priceDaily: 'RM30',
    priceWeekly: 'RM170',
    priceMonthly: 'RM550',
    priceDailyNum: 30,
    priceWeeklyNum: 170,
    priceMonthlyNum: 550,
  },
]
