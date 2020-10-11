import React from "react";
import { Form } from "react-final-form";
import { TextField } from "mui-rff";
import SaveIcon from "@material-ui/icons/Save";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { reqCustomers } from "services/customer";
import { reqUpdateCustomer } from "services/customer";

const CustomerForm = ({ customerData }: { customerData: object }) => {
  React.useEffect(() => {
    reqCustomers();
  }, []);

  const handlerCustomer = (values: object, form: { reset: Function }) => {
    return reqUpdateCustomer(values).then(() => {
      setTimeout(() => {
        form.reset({
          ...values,
        });
      }, 100);
    });
  };

  return (
    <Form
      onSubmit={handlerCustomer}
      initialValues={customerData}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            ข้อมูลลูกค้า
          </Typography>

          <TextField
            name="name"
            variant="outlined"
            label="ชื่อลูกค้า"
            margin="dense"
            type="text"
          />

          <TextField
            name="phone"
            variant="outlined"
            label="เบอร์โทร"
            margin="dense"
            type="text"
          />

          <TextField
            name="address"
            variant="outlined"
            label="ที่อยู่"
            margin="dense"
            type="text"
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
export default CustomerForm;
