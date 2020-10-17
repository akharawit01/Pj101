type Base = {
  price: number;
  total: number;
};

type CalAreaHour = {
  hour: number;
} & Base;

type CalArea = {
  area: object;
} & Base;

export const calculateAreaHour = (hour: number, price: number): CalAreaHour => {
  return {
    hour,
    price,
    total: Number(hour) * price,
  };
};

export const calculateArea = (area: any, price: number): CalArea => {
  const rai = Number(area?.rai) * price || 0;
  const ngan = Number(area?.ngan) * (price / 4) || 0;
  const wa = Number(area?.wa) * (price / 1600) || 0;

  return {
    area,
    price,
    total: rai + ngan + wa,
  };
};
