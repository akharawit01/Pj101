import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import JobForm from "../JobForm";
import JobLists from "../JobLists";

const Job = () => {
  return (
    <Box my={3}>
      <Grid container spacing={3}>
        <Grid item md={3}>
          <JobForm jobData={{}} />
        </Grid>
        <Grid item md={9}>
          <JobLists />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Job;
