import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { Autosuggest } from "components";
import { JobType, jobTypeDb, useJobType } from "services/jobType";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Form, Field } from "react-final-form";
import { Select } from "mui-rff";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(1),
    },
  })
);

const JobFilter: React.FC<any> = ({ setFilters, haveSearchName }) => {
  const [jobTypes, setJobTypes] = React.useState<JobType[] | any>(null);
  const classes = useStyles();

  useJobType<JobType>(
    () => jobTypeDb,
    {
      data: (resp) => {
        setJobTypes(resp);
      },
      error: () => {},
    },
    []
  );

  const onSubmit = (values: any) => {
    setFilters(values);
  };

  return (
    <Box mb={1}>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          status: "ทั้งหมด",
          type: "ทั้งหมด",
        }}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Box mt={2}>
              <Typography>ค้นหา</Typography>
            </Box>
            <Grid spacing={2} container direction="row" alignItems="center">
              {haveSearchName && (
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <Field name="customer" component={Autosuggest} />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Select
                  name="type"
                  label="ประเภท"
                  formControlProps={{
                    margin: "normal",
                    variant: "outlined",
                    size: "small",
                  }}
                >
                  <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
                  {jobTypes &&
                    jobTypes.map((type: JobType) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={2} lg={3}>
                <Select
                  name="status"
                  label="สถานะ"
                  formControlProps={{
                    margin: "normal",
                    variant: "outlined",
                    size: "small",
                  }}
                >
                  <MenuItem value="ทั้งหมด">ทั้งหมด</MenuItem>
                  <MenuItem value="ค้างจ่าย">ค้างจ่าย</MenuItem>
                  <MenuItem value="จ่ายแล้ว">จ่ายแล้ว</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SearchIcon />}
                >
                  ค้นหา
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={form.reset}
                  className={classes.button}
                >
                  ล้าง
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    </Box>
  );
};

export default JobFilter;
