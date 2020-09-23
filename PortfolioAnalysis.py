from dotenv import load_dotenv
from flask import Response
from flask import Flask
from flask import request
from flask import jsonify  
#fetching data
from polygon import RESTClient
from pprint import pprint
import pandas as pd
from datetime import date
import seaborn as sn
import os

#import matplotlib.pyplot as plt



load_dotenv()


key = os.getenv('POLYGON_API_KEY')


# RESTClient can be used as a context manager to facilitate closing the underlying http session
# https://requests.readthedocs.io/en/master/user/advanced/#session-objects
def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]
        
def fetch_historical_data(ticker_list):
    today = date.today()
    df_eod=pd.DataFrame()
    ticker_batches=chunks(ticker_list,5)
    print('fetching data')
    for batch in ticker_batches:
        with RESTClient(key) as client:
            for ticker in batch:
                resp = client.stocks_equities_aggregates(ticker, 1, timespan="day", from_="2019-01-01", to=today.strftime("%Y-%m-%d"));
                df_stock_agg = pd.DataFrame(resp.results);
                #set datatype and use time column as index
                #df_stock_agg=df_stock.astype({'t': 'datetime64[ns]'}).set_index('t');
                df_eod[ticker]=df_stock_agg['c'].values;
    
                if df_eod.index.name!='time':
                    df_eod['time']=pd.to_datetime(df_stock_agg['t'],unit='ms');
                    df_eod['time']=df_eod['time'].dt.normalize()
                    df_eod=df_eod.set_index('time')
                
    df_eod.to_csv('portfolio_eod_data.csv')
    
    return df_eod[ticker_list]
        
#input list of tickers
def get_historical_data(portfolio_tickers,getLatest=False):
    saved_tickers = pd.read_csv('portfolio_eod_data.csv',index_col=0, nrows=0).columns.tolist()
    fetch_tickers = []
    portfolio_tickers_set = set(portfolio_tickers)
    saved_tickers_set = set(saved_tickers)
    all_tickers_set = portfolio_tickers_set.union(saved_tickers_set)
    
    df_eod = pd.DataFrame()
    if(getLatest or not portfolio_tickers_set.issubset(saved_tickers_set)):
        df_eod = fetch_historical_data(list(all_tickers_set))
        df_eod = df_eod[portfolio_tickers]
    else:    
        df_eod = pd.read_csv('portfolio_eod_data.csv',index_col=0, usecols=['time']+portfolio_tickers)
    return df_eod
     
app = Flask(__name__) # name for the Flask app (refer to output)

portfolio_dict = {}
@app.route(r'/api/python/ping', methods=['GET'])
def test():
    print('pong')
    return Response(status=200)
@app.route(r'/api/python/portfolio/correlation', methods=['POST'])
def post_portfolio():
    print('executing code')
    portfolio_dict = request.get_json()
    df_eod=get_historical_data(list(portfolio_dict.keys()))
    corrMatrix = df_eod.corr()
    #sn.heatmap(corrMatrix, annot=True)
    #plt.show()
    resp={'tickers':list(corrMatrix.columns.values),'corr_matrix':corrMatrix.values.tolist()}
    return jsonify(resp)
# running the server
app.run(debug = False) # to allow for debugging and auto-reload



    