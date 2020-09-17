import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';


import SearchBar from "material-ui-search-bar";
//import Deposits from './Deposits';
//import Orders from './Orders';
import { useCookies } from 'react-cookie';
import {useHistory} from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  searchBar:{
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp, 
      duration: theme.transitions.duration.shortest
    })
  },
  chartGridItem:{
    order:3,
    [theme.breakpoints.up('sm')]: {
      order:2
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp, 
      duration: theme.transitions.duration.shortest
    })  
  },
  purchaseGridItem:{
    order:2,
    [theme.breakpoints.up('sm')]: {
      order:3
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp, 
      duration: theme.transitions.duration.shortest
    }),
  },
  
  

}));


let purchaseProps={
  symbol:"",
  price:0,
  timestamp: Date.now()
}


export default (props)=> {
  const classes = useStyles();
  const [searchVal, setSearchVal] = React.useState("");
  const [cookie,setCookie] = useCookies('isLoggedIn');
  const history = useHistory();
  
  
  const handleRequestSearch = () => {
    history.push('/search/'+searchVal);
  };
 
  return (
        <SearchBar
            value={searchVal}
            onChange={(newValue) => {setSearchVal(newValue.toUpperCase().trim())}}
            onRequestSearch={handleRequestSearch}
            placeholder='Enter symbol (Ex: AAPL)'
        />
  );
}