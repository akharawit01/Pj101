import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
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
              <Grid container spacing={3}>
                <FieldArray name="jobTypes">
                  {({ fields }) => (
                    <>
                      {fields.map((name, i) => (
                        <React.Fragment key={name}>
                          <Grid item xs={12}>
                            <Box
                              borderBottom={1}
                              color="white"
                              bgcolor="palevioletred"
                              p={1}
                              fontFamily="h6.fontFamily"
                              fontSize={{
                                xs: "h6.fontSize",
                              }}
                            >
                              #{`${i + 1}`}
                            </Box>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <TextField
                              name={`${name}.name`}
                              label="ชื่อประเภทงาน"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={4} xs={6}>
                            <TextField
                              name={`${name}.price`}
                              label="ราคา"
                              type="number"
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={2} xs={6}>
                            <Checkboxes
                              name={`${name}.perHour`}
                              data={{ label: "/ชม.", value: true }}
                            />
                          </Grid>
                        </React.Fragment>
                      ))}
                      <Grid item xs={12}>
                        <Box my={3}>
                          <MuiLink
                            href="#"
                            onClick={() =>
                              !fetching && fields.push({ name: "", price: "" })
                            }
                          >
                            เพิ่มรายการ
                          </MuiLink>
                        </Box>
                      </Grid>
                    </>
                  )}
                </FieldArray>
              </Grid>

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
