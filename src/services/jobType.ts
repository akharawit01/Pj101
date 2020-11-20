import { useEffect } from "react";
import { flow } from "lodash";
import { map, filter } from "lodash/fp";
import { db, auth } from "../firebase";
import { dataFromSnapshot } from "utils/misc";
import { DocumentData } from "@google-cloud/firestore";

export type JobType = {
  id?: string;
  author: string;
  name?: string;
  price?: number;
};
interface FirebaseHookHandlers {
  subscribe?: () => void;
  error?: (error: Error) => void;
  unsubscribe?: () => void;
}
interface DocHandlers<T extends JobType> extends FirebaseHookHandlers {
  data: (data: T | undefined) => void;
}

export const jobTypeDb = db.collection("jobType");
export const useJobType = <T extends JobType>(
  query: () => DocumentData,
  handlers: DocHandlers<T>,
  deps?: any
): void => {
  useEffect(() => {
    handlers.subscribe && handlers.subscribe();
    const unsubscribeFromDoc = query().onSnapshot(
      (snapshot: any) => {
        const docs = flow(
          () => snapshot.docs,
          map(dataFromSnapshot),
          filter<T>((d) => !!d)
        )();
        handlers.data(docs);
      },
      (error: Error) => handlers.error && handlers.error(error)
    );
    return () => {
      handlers.unsubscribe && handlers.unsubscribe();
      unsubscribeFromDoc();
    };
  }, deps); // eslint-disable-line
};

export const reqHandleJobType = async (values: {
  jobTypes: JobType[];
}): Promise<void> => {
  const batch = db.batch();
  const uid = auth.currentUser?.uid;

  if (!values || !values?.jobTypes) throw new Error("jobTypes does not exist!");

  await values.jobTypes.forEach((value) => {
    if (value.id) {
      batch.update(jobTypeDb.doc(value.id), {
        ...value,
      });
    } else {
      batch.set(jobTypeDb.doc(), {
        ...value,
        author: uid,
      });
    }
  });

  return batch.commit();
};
