import React from "react";
import Grid from "@material-ui/core/Grid";
import { Card } from "components";
import { reqJobReport } from "services/report";
import { formatPrice } from "utils/misc";

type ReportKeys = {
  owe?: number;
  owePrice?: number;
  totalPrice?: number;
};

const Jobs = (props: any) => {
  const [fetching, setFetching] = React.useState(true);
  const [data, setData] = React.useState<ReportKeys>(null!);

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
      <Grid item md={4} sm={6} xs={12}>
        <Card label="จำนวนค้างจ่าย" value={data?.owe} loading={fetching} />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <Card
          label="จำนวนเงินค้างจ่าย"
          value={formatPrice(data?.owePrice)}
          loading={fetching}
        />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <Card
          label="จำนวนเงินจ่ายแล้ว"
          value={formatPrice(data?.totalPrice)}
          loading={fetching}
        />
      </Grid>
    </Grid>
  );
};
export default Jobs;
