import React, { Component } from 'react';
import { Paper, withStyles, Grid, Button, Typography } from '@material-ui/core';
import {logout} from "../services/authService"
import { withRouter } from 'react-router-dom';
const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(2)
    }
});

class Dashboard extends Component {
    handleLogout = () => {
        logout();
        this.props.history.push('/login')
    }
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                      <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleLogout}>Logout</Button> 
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Typography variant="h3" gutterBottom>
                       User Repository
                    </Typography> 
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                      {this.props.children}  
                    </Grid>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(withRouter(Dashboard));