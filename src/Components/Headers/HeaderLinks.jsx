/*eslint-disable*/
import React from "react";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// core components
import Button from "./../CustomButtons/Button";

import styles from "./../../Styles/headerLinksStyle";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  return (
    <List className={classes.list}>
                    <ListItem className={classes.listItem}>
                        <Button
                            color="transparent"
                            className={classes.navLink}
                            href="http://localhost:3000/#/"
                        >
                        Home
                        </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <Button
                            color="transparent"
                            className={classes.navLink}
                            href="http://localhost:3000/#/box"
                        >
                        Box
                        </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <Button
                            color="transparent"
                            className={classes.navLink}
                            href="http://localhost:3000/#/addcustomer"
                        >
                        Add Customer
                        </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <Button
                            color="transparent"
                            className={classes.navLink}
                            href="http://localhost:3000/#/customers"
                        >
                        View Customers
                        </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <Button
                            color="transparent"
                            className={classes.navLink}
                            href="http://localhost:3000/#/jobs"
                        >
                        View Jobs
                        </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <Button
                            color="transparent"
                            className={classes.navLink}
                            href="http://localhost:3000/#/dashboard"
                        >
                        Dashboard
                        </Button>
                    </ListItem>
                    <ListItem className={classes.listItem}>
                        <Button
                            color="transparent"
                            className={classes.navLink}
                            href="http://localhost:3000/#/logout"
                        >
                        Logout
                        </Button>
                    </ListItem>
                </List>
  );
}
