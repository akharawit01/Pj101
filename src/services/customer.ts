import camelcaseKeys from "camelcase-keys";
import { db, timestamp } from "../firebase";

export type Customer = {
  id: string;
  name?: string;
  balance?: {
    total: number;
    owe: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
    toDate: () => string;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
    toDate: () => string;
  };
};

const customerDb = db.collection("customer");
export const reqCustomers = (searchText?: string): Promise<unknown> => {
  return customerDb
    .orderBy("name")
    .startAt(searchText || "")
    .endAt(searchText + "\uf8ff")
    .limit(3)
    .get()
    .then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...camelcaseKeys(doc.data()),
      }));
    });
};

export const reqCreateCustomer = (
  values: Partial<Customer>
): Promise<unknown> => {
  return customerDb.add({
    ...values,
    created_at: timestamp,
    updated_at: timestamp,
  });
};

export const reqUpdateCustomer = (
  values: Partial<Customer>
): Promise<unknown> => {
  const { id, ...rest } = values;
  return customerDb.doc(id).set({
    ...rest,
    updated_at: timestamp,
  });
};

export const reqCustomer = (id: string) => {
  return customerDb.doc(id);
};
