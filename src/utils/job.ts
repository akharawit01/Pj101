type Base = {
  price: number;
  total: number;
};

type CalAreaHour = {
  hour?: number;
} & Base;

type CalArea = {
  area?: Area;
} & Base;

type Area = {
  rai?: number;
  ngan?: number;
  wa?: number;
};

export const calculateAreaHour = (
  hour: number | undefined,
  price: number
): CalAreaHour => {
  return {
    hour,
    price,
    total: Number(hour) * price,
  };
};

export const calculateArea = (
  area: Area | undefined,
  price: number
): CalArea => {
  const rai = Number(area?.rai) * price || 0;
  const ngan = Number(area?.ngan) * (price / 4) || 0;
  const wa = Number(area?.wa) * (price / 1600) || 0;

  return {
    area,
    price,
    total: rai + ngan + wa,
  };
};
