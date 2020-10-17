import React from "react";
import { Form, Field, FormSpy } from "react-final-form";
import { TextField, Radios } from "mui-rff";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Autosuggest, RadioLoading } from "components";
import { reqHandleJob } from "services/job";
import { reqJobTypes } from "services/jobType";
import { find } from "lodash";
import { calculateAreaHour, calculateArea } from "utils/job";
import { formatPrice } from "utils/misc";
import { jobValidation } from "utils/validation";

const JobForm = ({
  jobData,
  callBack,
}: {
  jobData: object;
  callBack?: any;
}) => {
  const [jobTypes, setJobTypes] = React.useState<any[]>([]);
  React.useEffect(() => {
    reqJobTypes().then((resp) => {
      setJobTypes(resp);
    });
  }, []);

  const handlerJob = (
    values: {
      area?: object;
      type?: string;
      hour?: any;
    } = {},
    form: { reset: Function }
  ) => {
    const jobType = find(jobTypes, { name: "ปรับที่" });
    const typePrice = find(jobTypes, { id: values?.type })?.price;
    let area;

    if (jobType?.id === values?.type) {
      area = calculateAreaHour(values.hour, typePrice);
    } else {
      area = calculateArea(values.area, typePrice);
    }

    const newValues = {
      ...values,
      ...area,
    };

    return reqHandleJob(newValues).then(() => {
      setTimeout(() => {
        form.reset({
          type: values.type,
        });
      }, 100);
      if (callBack) {
        callBack();
      }
    });
  };

  return (
    <Form
      onSubmit={handlerJob}
      validate={jobValidation}
      initialValues={{
        type: jobTypes[0]?.id,
        ...jobData,
      }}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              ผู้ว่างจ้าง
            </Typography>
            <Field name="customer" component={Autosuggest} />
          </Box>

          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              ประเภท
            </Typography>
            {jobTypes && !jobTypes.length ? (
              <RadioLoading />
            ) : (
              <Radios
                name="type"
                required={true}
                data={jobTypes.map((type) => ({
                  label: type.name,
                  value: type.id,
                }))}
              />
            )}
          </Box>

          <FormSpy subscription={{ values: true }}>
            {(props: any) => {
              const jobType = find(jobTypes, { name: "ปรับที่" });
              const typePrice = find(jobTypes, { id: props.values?.type })
                ?.price;

              if (!jobType) return null;
              if (jobType?.id === props.values?.type) {
                return (
                  <Box mb={2}>
                    <Typography variant="h6" gutterBottom>
                      เวลา
                    </Typography>
                    <TextField
                      name="hour"
                      variant="outlined"
                      label="ชั่วโมง"
                      margin="dense"
                      type="number"
                    />
                    <Box mt={2}>
                      <Typography component="div">
                        รวมเป็นเงิน:{" "}
                        {formatPrice(
                          calculateAreaHour(props.values?.hour, typePrice)
                            ?.total
                        )}
                      </Typography>
                    </Box>
                  </Box>
                );
              }

              return (
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    พื้นที่
                  </Typography>
                  <TextField
                    name="area.rai"
                    variant="outlined"
                    label="ไร่"
                    margin="dense"
                    type="number"
                  />
                  <TextField
                    name="area.ngan"
                    variant="outlined"
                    label="งาน"
                    margin="dense"
                    type="number"
                  />
                  <TextField
                    name="area.wa"
                    variant="outlined"
                    label="ตารางวา"
                    margin="dense"
                    type="number"
                  />
                  <Box mt={2}>
                    <Typography component="div">
                      รวมเป็นเงิน:{" "}
                      {formatPrice(
                        calculateArea(props.values.area, typePrice)?.total
                      )}
                    </Typography>
                  </Box>
                </Box>
              );
            }}
          </FormSpy>

          <hr />

          <TextField
            name="note"
            variant="outlined"
            label="เพิ่มเติม"
            margin="dense"
            multiline
            rows="3"
          />

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={submitting || pristine}
              fullWidth
            >
              บันทึกข้อมูล
            </Button>
          </Box>
        </form>
      )}
    />
  );
};
export default JobForm;