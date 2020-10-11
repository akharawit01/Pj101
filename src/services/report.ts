import { db } from "../firebase";
import { reqCustomer } from "./customer";

type OptionTypes = {
  customerId?: string;
};

const jobDb = db.collection("job");
export const reqJobReport = async (
  options: OptionTypes,
  observer: {
    next: Function;
    error?: Function;
  }
) => {
  let jobDbCustomized = jobDb.where("status", "==", "ค้างจ่าย");

  if (options.customerId) {
    const reference = await reqCustomer(options.customerId);
    jobDbCustomized = jobDbCustomized.where("customer", "==", reference);
  }

  jobDbCustomized.onSnapshot(async (querySnapshot: any) => {
    let owePrice = 0;

    querySnapshot.docs.forEach(async (doc: any) => {
      const { total } = doc.data();
      owePrice += total;
    });

    observer.next({
      owe: querySnapshot.size,
      owePrice,
    });
  });
};
