import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

type CardProps = {
  label: string;
  value: string | number | undefined;
  loading: boolean;
};

const Card = ({ label, value, loading }: CardProps) => {
  return (
    <Box
      component={Paper}
      p={2}
      boxShadow={0}
      bgcolor="secondary.main"
      color="primary.contrastText"
    >
      <Typography component="div" variant="body1">
        {label}
      </Typography>
      <Typography component="div" variant="h6" align="right">
        {loading ? <Skeleton /> : value}
      </Typography>
    </Box>
  );
};

export default Card;
