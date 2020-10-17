import camelcaseKeys from "camelcase-keys";
import { db, timestamp } from "../firebase";
import { reqCreateCustomer, reqCustomer } from "./customer";

interface OptionTypes {
  status?: string;
  customerId?: string;
  name?: string;
  limit?: number;
  last?: any;
}
const jobDb = db.collection("job");
export const reqJobs = async (
  options: OptionTypes,
  observer: {
    next: Function;
    error?: Function;
  }
) => {
  let jobDbCustomized = jobDb.orderBy("updated_at", "desc").limit(20);

  if (options.last) {
    jobDbCustomized = jobDbCustomized.startAfter(options.last);
  }

  if (options.customerId) {
    const reference = await reqCustomer(options.customerId);
    jobDbCustomized = jobDbCustomized.where("customer", "==", reference);
  }

  if (options.status && options.status !== "ทั้งหมด") {
    jobDbCustomized = jobDbCustomized.where("status", "==", options.status);
  }

  return jobDbCustomized.onSnapshot(async (querySnapshot: any) => {
    const lastVisible =
      querySnapshot.docs.length === 20
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : undefined;

    const allJobs = await Promise.all(
      await querySnapshot.docs.map(async (doc: any, i: number) => {
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
    observer.next({
      items: allJobs,
      pg: {
        total: querySnapshot.size || 0,
        lastVisible,
      },
    });
  });
};

export const reqHandleJob = async (values: any = {}) => {
  const batch = db.batch();
  const { id, customer, ...rest } = values;

  let refCustomer: any = null!;

  if (typeof customer !== "string") {
    refCustomer = await db.doc(`customer/${customer.id}`);
  } else {
    await reqCreateCustomer({
      name: customer,
    }).then((resp) => {
      refCustomer = db.doc(`customer/${resp.id}`);
    });
  }

  db.runTransaction(function (transaction) {
    return transaction.get(refCustomer).then(function (ctmDoc) {
      if (!ctmDoc.exists) {
        throw new Error("Document does not exist!");
      }

      const b: any = ctmDoc.data();

      if (id) {
        batch.update(jobDb.doc(id), {
          ...rest,
          customer: refCustomer || customer,
          updated_at: timestamp,
        });

        batch.update(refCustomer, {
          balance: {
            owe: Number(b?.balance?.total || 0) + rest.total,
            total: Number(b?.balance?.total || 0) + rest.total,
          },
        });
      } else {
        batch.set(jobDb.doc(), {
          ...rest,
          customer: refCustomer || customer,
          status: "ค้างจ่าย",
          created_at: timestamp,
          updated_at: timestamp,
        });

        batch.update(refCustomer, {
          balance: {
            owe: Number(b?.balance?.total || 0) + rest.total,
            total: Number(b?.balance?.total || 0) + rest.total,
          },
        });
      }

      batch.commit();
    });
  })
    .then(function (newPopulation) {
      console.log("Population increased to ", newPopulation);
    })
    .catch(function (err) {
      // This will be an "population is too big" error.
      console.error(err);
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
