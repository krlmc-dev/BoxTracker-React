import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Button from './CustomButtons/Button';
import Header from './Headers/Header'
import React from "react";
import styles from "./../Styles/navbarsStyle";



const useStyles = makeStyles(styles);

export default function NavBar() {
    const classes = useStyles();
    return (

        <Header
            brand="Box Tracker"
            color="dark"
            rightLinks={
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
            }
        />);
}