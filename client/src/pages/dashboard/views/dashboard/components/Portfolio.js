import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import EditPortfolioPanel from './EditPortfolioPanel';

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
    dialogPaper: { minWidth: "250px" },
  }));

function getPortfolioValue(stocks){
  return Object.keys(stocks).reduce((sum,symbol)=>sum+parseFloat(stocks[symbol].price,10)*parseFloat(stocks[symbol].quantity,10),0);
}


function StockListItems(props){ 
  const stocks = props.stocks;

  return Object.keys(stocks).map((symbol) =>
  <Fragment key={symbol}>
    <Box ml={1} mr={1}>
    <Grid container direction="row" alignContent='center'>
      <Grid item xs={4}>
        <ListItemText primary={symbol} />
      </Grid>
      <Grid item xs={4}>
        <ListItemText primary={"$"+stocks[symbol].price.toFixed(2)} style={{textAlign:"center"}}/>
      </Grid>
      <Grid item xs={4}>
        <ListItemText primary={stocks[symbol].quantity} style={{textAlign:"right"}}/>
      </Grid>
    </Grid>
    </Box>
    <Divider/>
  </Fragment>
  );
}



export default function Portfolio(props) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState(false);
  
  const handleCloseDialog= ()=>{
    setOpenDialog(false)
  
  }
  const handleOpenDialog= ()=>{
    setOpenDialog(true)
  }

  
  let portfolioValue=(getPortfolioValue(props.stocks)).toFixed(2);

  

  return (
    <Fragment>
    <Dialog open={openDialog} onClose={handleCloseDialog}  classes={{ paper: classes.dialogPaper}} >
      <EditPortfolioPanel stocks={props.stocks}/>
    </Dialog>
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
    <Button variant="contained" color="primary" onClick={handleOpenDialog}>Edit Portfolio</Button>
    </Fragment>
  );
}