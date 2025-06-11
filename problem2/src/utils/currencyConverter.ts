export const parseCurrencyValue = (value?: string): number => {
  return Number(value?.split('*|*')[1]);
};

export const calculateConvertedAmount = (
  sourceAmount: number,
  sourceRate: number,
  targetRate: number
): number => {
  return (sourceAmount * sourceRate) / targetRate;
};
