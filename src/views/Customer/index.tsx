import React from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";
import CustomerForm from "../CustomerForm";
import { reqCustomer } from "services/customer";
import JobLists from "../JobLists";
import { FullPageSpinner } from "components";
import { isEmpty } from "lodash";

const Customer = () => {
  const [customer, setCustomer] = React.useState<object>({});
  const [fetchnig, setFetching] = React.useState(true);
  let { id: customerId }: any = useParams();

  React.useEffect(() => {
    reqCustomer(customerId)
      .get()
      .then((querySnapshot: any) => {
        if (querySnapshot.exists) {
          setCustomer({
            id: querySnapshot.id,
            ...querySnapshot.data(),
          });
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, [customerId]);

  if (fetchnig) return <FullPageSpinner />;

  if (isEmpty(customer)) return <div>ไม่มีผู้ใช้นี้อยู่ในระบบ</div>;

  return (
    <Box my={3}>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <Box mb={2}>
            <Link to="/">
              <Typography>กลับไปหน้าหลัก</Typography>
            </Link>
          </Box>
          <CustomerForm customerData={customer} />
        </Grid>
        <Grid item md={9} xs={12}>
          <JobLists customerId={customerId} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Customer;
