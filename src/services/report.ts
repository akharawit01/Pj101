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
  let totalPrice = 0;
  let owePrice = 0;
  let oweCount = 0;

  let jobDbCustomized = jobDb.where("status", "==", "ค้างจ่าย");
  let jobDbCustomizedTotal = jobDb.where("status", "==", "จ่ายแล้ว");

  if (options.customerId) {
    const reference = await reqCustomer(options.customerId);
    jobDbCustomized = jobDbCustomized.where("customer", "==", reference);

    const referenceTotal = await reqCustomer(options.customerId);
    jobDbCustomizedTotal = jobDbCustomizedTotal.where(
      "customer",
      "==",
      referenceTotal
    );
  }

  jobDbCustomizedTotal.get().then(async (querySnapshot: any) => {
    await querySnapshot.docs.forEach(async (doc: any) => {
      const { total } = doc.data();
      totalPrice += total;
    });
  });

  jobDbCustomized.get().then(async (querySnapshot: any) => {
    oweCount = querySnapshot.size;

    await querySnapshot.docs.forEach(async (doc: any) => {
      const { total } = doc.data();
      owePrice += total;
    });

    observer.next({
      owe: oweCount,
      owePrice,
      totalPrice,
    });
  });
};
