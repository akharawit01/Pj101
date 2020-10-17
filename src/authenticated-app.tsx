import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { useAuth } from "./contexts";
import Job from "./views/Job";
import Customer from "./views/Customer";

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

const AuthenticatedApp = () => {
  const { signOut }: any = useAuth();
  const classes = useStyles();

  return (
    <div>
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
          <Button color="inherit" onClick={signOut}>
            ออกจากระบบ
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <AppRoutes />
      </Container>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Job} />
        <Route exact path="/report" component={() => <div>Report</div>} />
        <Route exact path="/jobs" component={Job} />
        <Route exact path="/customer/:id" component={Customer} />
        <Route path="*" component={() => <div>No Data.</div>} />
      </Switch>
    </Router>
  );
};
export default AuthenticatedApp;
