import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import JobForm from "../JobForm";
import JobLists from "../JobLists";
import JobFormMb from "../JobFormMb";

const Job: React.FC = () => {
  return (
    <Box my={3}>
      <Grid container spacing={3}>
        <Hidden smDown>
          <Grid item md={3} xs={12}>
            <JobForm />
          </Grid>
        </Hidden>

        {/* show mobile site */}
        <Hidden mdUp>
          <JobFormMb />
        </Hidden>

        <Grid item md={9} xs={12}>
          <JobLists />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Job;
