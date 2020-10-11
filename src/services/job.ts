import camelcaseKeys from "camelcase-keys";
import { db, timestamp } from "../firebase";
import { reqCreateCustomer, reqCustomer } from "./customer";

type OptionTypes = {
  status?: string;
  customerId?: string;
  name?: string;
};

const jobDb = db.collection("job");
export const reqJobs = async (
  options: OptionTypes,
  observer: {
    next: Function;
    error?: Function;
  }
) => {
  let jobDbCustomized = jobDb.orderBy("updated_at", "desc");

  if (options.customerId) {
    const reference = await reqCustomer(options.customerId);
    jobDbCustomized = jobDbCustomized.where("customer", "==", reference);
  }

  if (options.status && options.status !== "ทั้งหมด") {
    jobDbCustomized = jobDbCustomized.where("status", "==", options.status);
  }

  jobDbCustomized.onSnapshot(async (querySnapshot: any) => {
    const allJobs = await Promise.all(
      await querySnapshot.docs.map(async (doc: any) => {
        const { customer, ...rest } = doc.data();
        let ctnObj = {};
        if (typeof customer === "object") {
          await customer.get().then((customerSnap: any) => {
            const { name, phone, address } = customerSnap.data();
            ctnObj = {
              id: customerSnap.id,
              name,
              phone,
              address,
            };
          });
        }

        return {
          id: doc.id,
          customer: ctnObj,
          ...camelcaseKeys(rest),
        };
      })
    );
    observer.next(allJobs);
  });
};

export const reqHandleJob = async (values: any = {}) => {
  const { id, customer, ...rest } = values;

  let refCustomer = null;
  if (typeof customer !== "string") {
    refCustomer = db.doc(`customer/${customer.id}`);
  } else {
    await reqCreateCustomer({
      name: customer,
    }).then((resp) => {
      refCustomer = db.doc(`customer/${resp.id}`);
    });
  }

  if (id) {
    return jobDb.doc(id).set({
      ...rest,
      customer: refCustomer || customer,
      updated_at: timestamp,
    });
  }

  return jobDb.add({
    ...rest,
    customer: refCustomer || customer,
    status: "ค้างจ่าย",
    created_at: timestamp,
    updated_at: timestamp,
  });
};

export const reqUpdateStatus = (id: string, status: string) => {
  return jobDb.doc(id).update({
    status,
    updated_at: timestamp,
  });
};

export const reqDeleteJob = (id: string) => {
  return jobDb.doc(id).delete();
};
