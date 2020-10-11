import camelcaseKeys from "camelcase-keys";
import { db, timestamp } from "../firebase";

const customerDb = db.collection("customer");
export const reqCustomers = (searchText: string = "") => {
  return customerDb
    .orderBy("name")
    .startAt(searchText)
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

export const reqCreateCustomer = (values: any = {}) => {
  return customerDb.add({
    ...values,
    created_at: timestamp,
    updated_at: timestamp,
  });
};

export const reqUpdateCustomer = (values: { id?: string } = {}) => {
  const { id, ...rest } = values;
  return customerDb.doc(id).set({
    ...rest,
    updated_at: timestamp,
  });
};

export const reqCustomer = (id: string = "") => {
  return customerDb.doc(id);
};
