import numeral from "numeral";
import { formatDistance } from "date-fns";
import { th } from "date-fns/locale";

export const formatPrice = (value: number = 0) =>
  numeral(value).format("0,0.00");

export const formatDistanceDatae = (value: any) =>
  formatDistance(value, new Date(), {
    locale: th,
  });
