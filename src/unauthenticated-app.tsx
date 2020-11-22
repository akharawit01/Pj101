import React from "react";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { TextField } from "mui-rff";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Form } from "react-final-form";
import { useAuth } from "./contexts";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const WrapLoginWithGoogle = styled.div`
  .google-btn {
    cursor: pointer;
    width: 100%;
    height: 42px;
    background-color: #4285f4;
    border-radius: 2px;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    .google-icon-wrapper {
      position: absolute;
      margin-left: 1px;
      width: 40px;
      height: 40px;
      border-radius: 2px;
      background-color: #fff;
    }
    .google-icon {
      position: absolute;
      margin-top: 11px;
      margin-left: 11px;
      width: 18px;
      height: 18px;
    }
    .btn-text {
      color: #fff;
      font-size: 14px;
      letter-spacing: 0.2px;
      margin-left: 55px;
    }
    &:hover {
      box-shadow: 0 0 6px #4285f4;
    }
    &:active {
      background: #1669f2;
    }
  }
`;

const UnauthenticatedApp: React.FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { signInWithGoogle, signInWithEmail }: any = useAuth();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          เข้าสู่ระบบ
        </Typography>
        <Form
          onSubmit={(values) =>
            signInWithEmail(values).catch((error: Error) => {
              enqueueSnackbar(error.message, {
                variant: "error",
              });
            })
          }
          render={({ handleSubmit }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="อีเมล"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="รหัสผ่าน"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                เข้าสู่ระบบ
              </Button>
            </form>
          )}
        />
      </div>
      <Box textAlign="center" py={3}>
        หรือ
      </Box>
      <WrapLoginWithGoogle>
        <div className="google-btn" onClick={signInWithGoogle}>
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              alt="btn google"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
          </div>
          <p className="btn-text">
            <strong>Sign in with google</strong>
          </p>
        </div>
      </WrapLoginWithGoogle>
    </Container>
  );
};

export default UnauthenticatedApp;
