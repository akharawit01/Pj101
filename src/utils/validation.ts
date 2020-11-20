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

const jobTypeSchema: Yup.ObjectSchema<any> = Yup.object()
  .shape({
    jobTypes: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
        price: Yup.number().min(100).max(5000).required(),
      })
    ),
  })
  .defined();

export const jobValidation = makeValidate(jobSchema);
export const jobTypeValidation = makeValidate(jobTypeSchema);
