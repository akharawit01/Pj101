import camelcaseKeys from "camelcase-keys";
import { db } from "../firebase";

const jobTypeDb = db.collection("jobType");
export const reqJobTypes = () => {
  return jobTypeDb
    .get()
    .then((querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...camelcaseKeys(doc.data()),
      }));
    });
};
