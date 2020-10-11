import React from "react";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

const RadioLoading = () => {
  return (
    <>
      <Typography variant="h4">
        <Skeleton />
      </Typography>
      <Typography variant="h4">
        <Skeleton />
      </Typography>
      <Typography variant="h4">
        <Skeleton />
      </Typography>
    </>
  );
};
export default RadioLoading;
