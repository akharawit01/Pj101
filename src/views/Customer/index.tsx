import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ReplyIcon from "@material-ui/icons/Reply";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";
import CustomerForm from "../CustomerForm";
import { Customer, reqCustomer } from "services/customer";
import JobLists from "../JobLists";
import { FullPageSpinner } from "components";
import { isEmpty } from "lodash";

const MzinCustomer: React.FC = () => {
  const [customer, setCustomer] = React.useState<Customer>();
  const [fetchnig, setFetching] = React.useState(true);
  const { push } = useHistory();
  const { id }: { id: string } = useParams();

  React.useEffect(() => {
    reqCustomer(id)
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
  }, [id]);

  if (fetchnig) return <FullPageSpinner />;

  if (isEmpty(customer)) return <div>ไม่มีผู้ใช้นี้อยู่ในระบบ</div>;

  return (
    <Box my={3}>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <Box mb={2}>
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
          </Box>
          <CustomerForm customerData={customer} />
        </Grid>
        <Grid item md={9} xs={12}>
          <JobLists customerId={id} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default MzinCustomer;
