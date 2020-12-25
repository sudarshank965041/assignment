import React,{Component} from 'react';
import { Paper, withStyles, Grid, Button, TextField } from '@material-ui/core';
import BackdropLoader from '../shared/loader';
import fetchGraphQL from '../services/fetchMethod';
import { formattedDate, formattedTime } from '../shared/DateTimeFormatter';
import Link from '@material-ui/core/Link';
import messagePopup from '../shared/messagePopup';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing()
    }
});

class RepoDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loader: false,
          repository: null,
          repositoryName: '',
          repositoryDesc: '',
          disableNameLabel: false,
          disableDescLabel: false
        };
      }
    async componentDidMount() {
       console.log('TTTT : ',this.props);
       if(this.props && this.props.match && this.props.match.params){
          const {owner,name} = this.props.match.params;
          if(owner && name) {
            this.setState({loader: true})
            console.log('XXXX : ',name,owner);
            fetchGraphQL(`
              query {
                repository(name: "${name}",owner: "${String(owner)}") {
                  issues(last: 5) {
                        totalCount
                        nodes {
                          id
                          title
                          url
                        }
                      }
                  name
                  id
                  createdAt
                  description
                  url 
                }
              }  
            `).then(response => {
              if(response && response.data && response.data.repository){
                  console.log('****** : ',response.data.repository);
                const {name,description} = response.data.repository
                this.setState({repository: response.data.repository,repositoryName: name,repositoryDesc: description})
              }
              this.setState({loader: false})
            }).catch(error => {
              console.error(error);
              this.setState({loader: false})
            });
          }
       }
    }
    getFromattedDateTime = (datetime) => {
        if(datetime) {
          return formattedDate(datetime) + ' ' + formattedTime(datetime)
        }
        return '';
    }
    onEditName = () => {
      this.setState({disableNameLabel: !this.state.disableNameLabel})
    }
    onEditDesc = () => {
      this.setState({disableDescLabel: !this.state.disableDescLabel})
    }
    handleNameChange = (e) => {
      this.setState({repositoryName: e.target.value})
    }
    handleDescChange = (e) => {
      this.setState({repositoryDesc: e.target.value})
    }

    handleUpdate = () => {
        this.setState({loader: true})
        fetchGraphQL(`
         mutation{
            updateRepository(input: {repositoryId: "${this.state.repository.id}",name: "${this.state.repositoryName}",description: "${this.state.repositoryDesc}"}){
              repository{
                name
                description
              }
            }
          }    
      `).then(response => {
        console.log('Data 5555 : ',response);
        if(response) {
           if(response.errors && response.errors[0].message) {
            messagePopup('', response.errors[0].message , 'error');
           } else {
             messagePopup('', 'Updated successfully.' , 'success'); 
           }
        }
        this.setState({loader: false})
      }).catch(error => {
        console.error(error);
        this.setState({loader: false})
      }); 
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.padding}>
                <BackdropLoader open={this.state.loader} />
                <div className={classes.margin}>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        {this.state.repository && (
                         <ul>
                            <li>
                                <span>Repository Name :</span>
                                {!this.state.disableNameLabel ? (
                                    <span style={{paddingRight:'10px'}}>{this.state.repository.name}</span>
                                ) : (
                                  <TextField label="name" variant="outlined" value={this.state.repositoryName} onChange={this.handleNameChange}/>
                                )}
                                {!this.state.disableNameLabel && (
                                 <span>
                                   <Link href="#" color="primary" onClick={this.onEditName}>
                                       edit
                                   </Link>
                                  </span>
                                )}
                                
                            </li>
                            <li>
                                <span>Description :</span>
                                {!this.state.disableDescLabel ? (
                                   <span  style={{paddingRight:'10px'}}>{this.state.repository.description}</span>
                                ) : (
                                    <TextField label="description" variant="outlined" value={this.state.repositoryDesc} onChange={this.handleDescChange}/>
                                )}
                                {!this.state.disableDescLabel && (
                                 <span>
                                   <Link href="#" color="primary" onClick={this.onEditDesc}>
                                       edit
                                   </Link>
                                 </span>
                                )}
                                
                            </li>
                            <li>
                                <span>Created Date & Time :</span>
                                <span>{this.getFromattedDateTime(this.state.repository.createdAt)}</span>
                            </li>
                            <li>
                                <span>Github URL :</span>
                                <span>{this.state.repository.url}</span>
                            </li>
                            <li>
                                <span>Bugs Count :</span>
                                <span>{this.state.repository.issues.totalCount}</span>
                            </li>
                            <li>
                                <span>Bugs URL :</span>
                                <span>
                                   <Link href={`${this.state.repository.url}/issues`} color="primary" target='_blank'>
                                      {`${this.state.repository.url}/issues`}
                                   </Link>
                                </span>
                            </li>
                          </ul>
                        )}
                    </Grid>
                    {(this.state.disableNameLabel || this.state.disableDescLabel) && (
                      <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleUpdate}>Update</Button>
                      </Grid>
                    )}
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(RepoDetails);