import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import DialogContent from "@material-ui/core/DialogContent";
import JobForm from "../JobForm";
import { Job } from "services/job";

const Jobs: React.FC<{
  jobData: Job;
  handleDelete: () => Promise<any>;
}> = (props) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { handleDelete, ...rest } = props;

  return (
    <>
      <Button variant="contained" size="small" onClick={handleClickOpen}>
        แก้ไข
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen
      >
        <DialogContent>
          <h2>แก้ไขงาน</h2>
          <JobForm {...rest} callBack={handleClose} />
          <Box my={2}>
            <Button
              onClick={() => {
                handleDelete().then(() => {
                  handleClose();
                });
              }}
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
            >
              ลบรายการ
            </Button>
          </Box>
          <Button onClick={handleClose} color="primary" size="large" fullWidth>
            ปิดหน้าต่าง
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Jobs;
