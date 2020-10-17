import { makeValidate } from "mui-rff";
import * as Yup from "yup";

type Job = {
  customer?: string | object;
  area?: object | undefined;
  type?: string | undefined;
  hour?: any;
};

const jobSchema: Yup.ObjectSchema<Job> = Yup.object()
  .shape({
    customer: Yup.string().required(),
  })
  .defined();

export const jobValidation = makeValidate(jobSchema);
