import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { reqJobReport } from "services/report";
import numeral from "numeral";

type ReportKeys = {
  owe?: number;
  owePrice?: number;
};

const Jobs = (props: any) => {
  const [fetching, setFetching] = React.useState(true);
  const [data, setData] = React.useState<ReportKeys | null>(null);

  React.useEffect(() => {
    reqJobReport(
      { customerId: props?.customerId },
      {
        next: (querySnapshot: any) => {
          setData(querySnapshot);
          setFetching(false);
        },
      }
    );
  }, [props]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={3}>
        <Box
          component={Paper}
          p={2}
          boxShadow={0}
          bgcolor="secondary.main"
          color="primary.contrastText"
        >
          <Typography component="div" variant="body1">
            จำนวนค้างจ่าย
          </Typography>
          <Typography component="div" variant="h6" align="right">
            {fetching ? <Skeleton /> : data?.owe}
          </Typography>
        </Box>
      </Grid>

      <Grid item sm={3}>
        <Box
          component={Paper}
          p={2}
          boxShadow={0}
          bgcolor="secondary.main"
          color="primary.contrastText"
        >
          <Typography component="div" variant="body1">
            จำนวนเงินค้างจ่าย
          </Typography>
          <Typography component="div" variant="h6" align="right">
            {fetching ? <Skeleton /> : numeral(data?.owePrice).format("0,0.00")}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
export default Jobs;
