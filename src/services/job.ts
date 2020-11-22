import camelcaseKeys from "camelcase-keys";
import { db, auth, timestamp } from "../firebase";
import { reqCreateCustomer, reqCustomer, Customer } from "./customer";

export type Job = {
  id: string;
  author: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
  status: string;
  type: string;
  total: number;
  hour?: number;
  price: number;
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
type OptionTypes = {
  type?: string;
  status?: string;
  customerId?: string;
  customer?: Customer;
  name?: string;
  limit?: number;
  last?: unknown;
};

const jobDb = db.collection("job");
export const reqJobs = async (
  options: OptionTypes,
  observer: {
    next?: (querySnapshot: any) => void | undefined;
    error?: (() => void) | undefined;
  }
): Promise<unknown> => {
  let jobDbCustomized = jobDb
    .orderBy("updated_at", "desc")
    .limit(10)
    .where("author", "==", auth?.currentUser?.uid);

  if (options.last) {
    jobDbCustomized = jobDbCustomized.startAfter(options.last);
  }

  if (options.customerId) {
    const reference = await reqCustomer(options.customerId);
    jobDbCustomized = jobDbCustomized.where("customer", "==", reference);
  }

  if (options.customer && options.customer.id) {
    const reference = await reqCustomer(options.customer.id);
    jobDbCustomized = jobDbCustomized.where("customer", "==", reference);
  }

  if (options.status && options.status !== "ทั้งหมด") {
    jobDbCustomized = jobDbCustomized.where("status", "==", options.status);
  }

  if (options.type && options.type !== "ทั้งหมด") {
    jobDbCustomized = jobDbCustomized.where("type", "==", options.type);
  }

  return jobDbCustomized.onSnapshot(
    async (querySnapshot: any) => {
      const lastVisible =
        querySnapshot.docs.length === 10
          ? querySnapshot.docs[querySnapshot.docs.length - 1]
          : undefined;

      const allJobs = await Promise.all(
        await querySnapshot.docs.map(async (doc: any) => {
          const { customer, ...rest } = doc.data();
          let ctnObj = {};
          if (typeof customer === "object") {
            await customer.get().then((customerSnap: any) => {
              if (customerSnap.data()) {
                const { name, phone, address } = customerSnap.data();
                ctnObj = {
                  id: customerSnap.id,
                  name,
                  phone,
                  address,
                };
              }
            });
          }

          return {
            id: doc.id,
            customer: ctnObj,
            ...camelcaseKeys(rest),
          };
        })
      );

      observer.next &&
        observer.next({
          items: allJobs,
          pg: {
            total: querySnapshot.size || 0,
            lastVisible,
          },
        });
    },
    (err) => {
      console.log(err);
      observer.error && observer.error();
    }
  );
};

export const reqHandleJob = async (values: any = {}): Promise<void> => {
  const batch = db.batch();
  const uid = auth.currentUser?.uid;
  const { id, customer, ...rest } = values;

  let refCustomer: any = null!;

  if (typeof customer !== "string") {
    refCustomer = await db.doc(`customer/${customer.id}`);
  } else {
    await reqCreateCustomer({
      name: customer,
      author: uid,
    }).then((resp: any) => {
      refCustomer = db.doc(`customer/${resp.id}`);
    });
  }

  return db.runTransaction(function (transaction) {
    return transaction.get(refCustomer).then(function (ctmDoc) {
      if (!ctmDoc.exists) {
        throw new Error("Document does not exist!");
      }

      if (id) {
        batch.update(jobDb.doc(id), {
          ...rest,
          author: uid,
          customer: refCustomer || customer,
          updated_at: timestamp,
        });

        // batch.update(refCustomer, {
        //   balance: {
        //     owe: Number(b?.balance?.total || 0) + rest.total,
        //     total: Number(b?.balance?.total || 0) + rest.total,
        //   },
        // });
      } else {
        batch.set(jobDb.doc(), {
          ...rest,
          customer: refCustomer || customer,
          status: "ค้างจ่าย",
          author: uid,
          created_at: timestamp,
          updated_at: timestamp,
        });

        // batch.update(refCustomer, {
        //   balance: {
        //     owe: Number(b?.balance?.total || 0) + rest.total,
        //     total: Number(b?.balance?.total || 0) + rest.total,
        //   },
        // });
      }

      batch.commit();
    });
  });
};

export const reqUpdateStatus = (id: string, status: string): Promise<void> => {
  return jobDb.doc(id).update({
    status,
    updated_at: timestamp,
  });
};

export const reqDeleteJob = (id: string): Promise<void> => {
  return jobDb.doc(id).delete();
};
