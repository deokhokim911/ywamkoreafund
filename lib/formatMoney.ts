type TranslateFn = (key: string, values?: Record<string, string | number>) => string

/** Format KRW for UI. KO uses 만/억 shorthand; EN uses full ₩ amount. */
export const formatMoney = (
  amount: number,
  locale: string,
  t: TranslateFn,
): string => {
  if (locale.startsWith('en')) {
    return `₩${amount.toLocaleString('en-US')}`
  }
  if (amount >= 100_000_000) {
    return t('currency.eokWon', {
      amount: (amount / 100_000_000).toFixed(1),
    })
  }
  if (amount >= 10_000) {
    return t('currency.manWon', {
      amount: Math.floor(amount / 10_000).toLocaleString('ko-KR'),
    })
  }
  return t('currency.won', {
    amount: amount.toLocaleString('ko-KR'),
  })
}
