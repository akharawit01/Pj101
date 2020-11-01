import { makeValidate } from "mui-rff";
import * as Yup from "yup";

type Job = {
  customer?: string;
  area?:
    | {
        rai?: number;
        ngan?: number;
        wa?: number;
      }
    | undefined;
  type?: string | undefined;
  hour?: number | undefined;
};

const jobSchema: Yup.ObjectSchema<Job> = Yup.object()
  .shape({
    customer: Yup.string().required(),
  })
  .defined();

export const jobValidation = makeValidate(jobSchema);
