import React from "react";
import { Link, BrowserRouter, Switch, Route } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import MuiLink from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { useAuth } from "./contexts";
import Job from "./views/Job";
import Customer from "./views/Customer";
import Setting from "./views/Setting";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const AuthenticatedApp: React.FC = () => {
  const { signOut }: any = useAuth();
  const classes = useStyles();

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            PJ-101
          </Typography>
          <MuiLink
            color="inherit"
            component={Link}
            to="/setting"
            style={{ marginRight: "15px" }}
          >
            ตั้งค่า
          </MuiLink>
          <Button variant="outlined" color="inherit" onClick={signOut}>
            ออกจากระบบ
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <AppRoutes />
      </Container>
    </BrowserRouter>
  );
};

const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Job} />
      <Route exact path="/report" component={() => <div>Report</div>} />
      <Route exact path="/jobs" component={Job} />
      <Route exact path="/customer/:id" component={Customer} />
      <Route exact path="/setting" component={Setting} />
      <Route path="*" component={() => <div>No Data.</div>} />
    </Switch>
  );
};
export default AuthenticatedApp;
