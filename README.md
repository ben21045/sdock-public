# Sdock
The Premier Stock Portfolio Dashboard
## Project Overview
Quickly curate your own stock portfolios. Evaluate your designed portfolios with metrics on your own dashboard. The application uses the following technology stack:
1. PostgreSQL - Database
2. ExpressJS - Backend and routing
3. ReactJS - Frontend
4. NodeJS - JavaScript runtime

## Prerequisites
  - NodeJS
  - Python3
  - PostgreSQL
## Getting started with hosting your own application (local)
- Set up your postgres server
- Create a new database for the application
  * Create session table
  * Create users table
  * Create portfolio table
- Clone the repository
- Install all npm packages with ```npm install```
- Create a .env file in the top level directory
specify the following variables in the .env file:

```
PGDATABASE = #postgres database name 
PGHOST = #postgres host
PGPORT = #postgres port
PGUSER = #postgres user name
PGPASSWORD = #postgres user name
APIPORT = #port that api server will be hosted on 
CLIENTPORT=3000
ALPHA_VANTAGE_API_KEY="4X80TIMW4V80CPI1"
IEX_CLOUD_TOKEN="pk_03217f9d942b4dcc8e74090d31e8a388"
POLYGON_API_KEY="PUTshpiZHObuDZXBXYZhpTop3Bcfdt5l"
```

- Run client and server with ```npm start```
- Run python server with ```python PortfolioAnalysis.py```
