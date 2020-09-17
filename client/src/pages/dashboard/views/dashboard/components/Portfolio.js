import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 420,
      backgroundColor: theme.palette.background.paper,

    },
    symbolColumn: {
      marginLeft: 'auto',
    },
    qtyColumn: {
      marginRight: 'auto',
    },
  }));

function getPortfolioValue(stocks){
  return stocks.reduce((sum,stock)=>sum+parseFloat(stock.price,10)*parseFloat(stock.quantity,10),0);
}

function StockListItems(props){ 
  const stocks = props.stocks;

  return stocks.map((stock) =>
  <Fragment>
    <Box ml={1} mr={1}>
    <Grid container direction="row" alignContent='center'>
      <Grid item xs={4}>
        <ListItemText primary={stock.symbol} />
      </Grid>
      <Grid item xs={4}>
        <ListItemText primary={"$"+stock.price.toFixed(2)} style={{textAlign:"center"}}/>
      </Grid>
      <Grid item xs={4}>
        <ListItemText primary={stock.quantity} style={{textAlign:"right"}}/>
      </Grid>
    </Grid>
    </Box>
    <Divider/>
  </Fragment>
  );
}
export default function Portfolio(props) {
  const classes = useStyles();
  let portfolioValue=(getPortfolioValue(props.stocks)).toFixed(2);
  
  return (
    <List component="nav" className={classes.root} >
      <Typography  variant="h6">
        My Portfolio
      </Typography>
      <Typography  variant="h4">
        ${portfolioValue}
      </Typography>
      <Box ml={1} mr={1}>
        <Grid container direction="row" alignContent='center'>
        <Grid item xs={4}>
          <ListItemText secondary="Symbol" />
        </Grid>
        <Grid item xs={4}>
          <ListItemText secondary="Price" style={{textAlign:"center"}}/>
        </Grid>
        <Grid item xs={4}>
          <ListItemText secondary="Quantity" style={{textAlign:"right"}}/>
        </Grid>
        </Grid>
      </Box>
      {/*<Grid container direction="row" alignContent='center' justify="space-between">
        <Grid item><ListItemText secondary="Symbol" /></Grid>
        <Grid item><ListItemText secondary="Price" /></Grid>
        <Grid item><ListItemText secondary="Quantity" /></Grid>
  </Grid>*/}

      <Divider/>
      <StockListItems stocks={props.stocks}/>
    </List>
  );
}