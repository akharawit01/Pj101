import numeral from "numeral";
import camelcaseKeys from "camelcase-keys";
import { formatDistance } from "date-fns";
import { th } from "date-fns/locale";

export const formatPrice = (value: number = 0): string =>
  numeral(value || 0).format("0,0.00");

export const formatDistanceDatae = (value: any): string =>
  formatDistance(value, new Date(), {
    locale: th,
  });

interface Entity {
  id: string;
}

export const dataFromSnapshot = <T extends Entity>(
  snapshot: any
): T | undefined => {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data() as any;
  return {
    ...camelcaseKeys(data),
    id: snapshot.id,
  };
};
