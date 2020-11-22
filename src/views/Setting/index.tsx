import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import ReplyIcon from "@material-ui/icons/Reply";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Form } from "react-final-form";
import { TextField, Checkboxes } from "mui-rff";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  JobType,
  jobTypeDb,
  useJobType,
  reqHandleJobType,
} from "services/jobType";
import { jobTypeValidation } from "utils/validation";
import { useSnackbar } from "notistack";

const variants = ["h1", "h2", "h3"] as TypographyProps["variant"][];
const SettingLoading: React.FC = () => {
  return (
    <div>
      {variants.map((variant) => (
        <Box display="flex" key={variant}>
          <Box flexGrow={1}>
            <Typography component="div" key={variant} variant={variant}>
              <Skeleton />
            </Typography>
          </Box>
          <Box pl={3} width="200px">
            <Typography component="div" key={variant} variant={variant}>
              <Skeleton />
            </Typography>
          </Box>
          <Box pl={3} width="150px">
            <Typography component="div" key={variant} variant={variant}>
              <Skeleton />
            </Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
};

const Setting: React.FC = () => {
  const [jobTypes, setJobTypes] = React.useState<JobType[] | any>([]);
  const [fetching, setFetching] = React.useState(true);
  const { push } = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useJobType<JobType>(
    () => jobTypeDb,
    {
      data: (resp) => {
        setJobTypes(resp);
        setFetching(false);
      },
      error: () => {
        setFetching(false);
      },
    },
    []
  );

  return (
    <Container maxWidth="md">
      <Box py={2}>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          startIcon={<ReplyIcon />}
          onClick={() => {
            push("/");
          }}
        >
          กลับไปหน้าหลัก
        </Button>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            ตั้งค่า
          </Typography>
        </Box>

        {fetching && <SettingLoading />}
        <Form
          onSubmit={(values) =>
            reqHandleJobType(values)
              .then(() => {
                enqueueSnackbar("บันทึกรายการเรียบร้อยแล้ว!", {
                  variant: "success",
                });
              })
              .catch(() => {
                enqueueSnackbar("บันทึกข้อมูลผิดพลาด!", {
                  variant: "error",
                });
              })
          }
          initialValues={{
            jobTypes: jobTypes,
          }}
          validate={jobTypeValidation}
          mutators={{
            ...arrayMutators,
          }}
          render={({ handleSubmit, pristine, invalid }) => (
            <form onSubmit={handleSubmit}>
              <FieldArray name="jobTypes">
                {({ fields }) => (
                  <Box mb={2}>
                    {fields.map((name) => (
                      <Box display="flex" py={2} key={name}>
                        <Box flexGrow={1}>
                          <TextField
                            name={`${name}.name`}
                            label="ชื่อประเภทงาน"
                            variant="outlined"
                          />
                        </Box>
                        <Box pl={3} width="200px">
                          <TextField
                            name={`${name}.price`}
                            label="ราคา"
                            type="number"
                            variant="outlined"
                          />
                        </Box>
                        <Box pl={3} width="150px">
                          <Checkboxes
                            name={`${name}.perHour`}
                            data={{ label: "/ชม.", value: true }}
                          />
                        </Box>
                      </Box>
                    ))}
                    <MuiLink
                      href="#"
                      onClick={() =>
                        !fetching && fields.push({ name: "", price: "" })
                      }
                    >
                      เพิ่มรายการ
                    </MuiLink>
                  </Box>
                )}
              </FieldArray>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={pristine || invalid}
              >
                บันทึกข้อมูล
              </Button>
            </form>
          )}
        />
      </Box>
    </Container>
  );
};

export default Setting;
