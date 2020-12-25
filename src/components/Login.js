import React,{Component} from 'react';
import { Paper, withStyles, Grid, Button } from '@material-ui/core';
import {Client_ID, Client_Secrets} from "../config"
import {setAuthToken} from "../services/authService"
import axios from "axios";
import BackdropLoader from '../shared/loader';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing()
    }
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loader: false,
        };
      }
    async componentDidMount() {
        if(this.props &&  this.props.location && this.props.location.search){
            const code = new URLSearchParams(this.props.location.search).get('code')
            console.log('code : ',code);
            if(code) {
                const queryParam = `client_id=${Client_ID}&client_secret=${Client_Secrets}&code=${code}`
                console.log('queryParam : ',queryParam);
                this.setState({loader: true})
                try {
                    const response = await axios.post(`https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?${queryParam}`);
                    this.setState({loader: false}) 
                    if(response && response.data){
                       const access_token = new URLSearchParams(response.data).get('access_token')
                       console.log('access_token : ',access_token);
                       if(access_token){
                        setAuthToken(access_token)
                        this.props.history.push('/dashboard')
                       }
                    } 
                } catch (error) {
                   this.setState({loader: false}) 
                }
            }
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.padding}>
                <BackdropLoader open={this.state.loader} />
                <div className={classes.margin}>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <a href={`https://github.com/login/oauth/authorize?client_id=${Client_ID}`}>
                          <Button variant="outlined" color="primary" style={{ textTransform: "none" }}>Login with Github</Button>
                        </a>
                    </Grid>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(Login);