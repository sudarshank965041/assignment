import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import fetchGraphQL from '../services/fetchMethod';
import BackdropLoader from '../shared/loader';
import {formattedDate,formattedTime} from "../shared/DateTimeFormatter"
import { Grid,Button } from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const { useState, useEffect } = React;

export default function RepoList(props) {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [initialPage, setPage] = useState(5);
  const [repoList, setRepoList] = useState(null);
  const [owner, setOwner] = useState('')

  useEffect(() => {
    getRepoData()
  }, [initialPage]);

  const getRepoData = () => {
    setLoader(true)
    fetchGraphQL(`
      query {
        viewer {
          login
          repositories(first: ${initialPage}) {
            edges {
              node {
                id
                name
                url
                createdAt
              }
            }
          }
        }
      }
    `).then(response => {
      const data = response.data;
      const owner = data.viewer.login
      if(owner) {
        setOwner(owner)
      }
      if(data) {
        setRepoList(data.viewer.repositories.edges)
      }
      setLoader(false)
    }).catch(error => {
      console.error(error);
      setLoader(false)
    });
  }

  const getMoreRepo = async () => {
    setPage(initialPage + 5)
    // getRepoData()
  }

  const getFromattedDateTime = (datetime) => {
    if(datetime) {
      return formattedDate(datetime) + ' ' + formattedTime(datetime)
    }
    return '';
  }

  const handleRowClick = (row) => {
    if(row){
      props.history.push(`/repolist/${owner}/${row.name}`)
    }
  }

  return (
    <>
      <BackdropLoader open={loader} />
      <Grid container justify="center" style={{ marginTop: '10px' }}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">S.No</StyledTableCell>
                <StyledTableCell align="left">Name</StyledTableCell>
                <StyledTableCell align="left">Created Date</StyledTableCell>
                <StyledTableCell align="left">Link to github Repo</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repoList && repoList.map((row,index) => (
                <StyledTableRow key={index} onClick={() => handleRowClick(row.node)}>
                  <StyledTableCell align="left">{index + 1}</StyledTableCell>
                  <StyledTableCell align="left">{row.node.name}</StyledTableCell>
                  <StyledTableCell align="left" >{getFromattedDateTime(row.node.createdAt)}</StyledTableCell>
                  <StyledTableCell align="left">
                    <a href={row.node.url} target='_blank'>{row.node.url}</a>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>               
      </Grid>
      <Grid container justify="center" style={{ marginTop: '10px' }}>
        <Button variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={getMoreRepo}>More</Button>              
      </Grid>
      
    </>
  );
}
