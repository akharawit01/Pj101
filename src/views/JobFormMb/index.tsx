import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitleText from "@material-ui/core/DialogTitle";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import JobForm from "../JobForm";

const useStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: theme.zIndex.modal,
    },
  })
);

const JobFormMb: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab
        color="secondary"
        aria-label="add"
        onClick={handleClickOpen}
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullScreen
      >
        <DialogContent>
          <h2>เพิ่มงาน</h2>
          <JobForm callBack={handleClose} />
          <Box my={2}>
            <Button onClick={handleClose} color="primary" fullWidth>
              ปิดหน้าต่าง
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default JobFormMb;
