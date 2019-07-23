import { of, from, timer, zip, fromEvent } from 'rxjs';
import {
  map, mergeMap, tap, first, take, switchMap, scan, reduce
  , takeUntil
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import * as firebase from 'firebase';


const ALPHA_VANTAGE_API_KEY = 'I89D9W67H9TP10N5'

type Currency = 'AUD' | 'CAD' | 'CHF' | 'JPY' | 'NZD' | 'USD' | 'EUR' | 'GBP';

type CurrencyExchange = [Currency, Currency];

const AUDCAD: CurrencyExchange = ['AUD', 'CAD'];
const AUDCHF: CurrencyExchange = ['AUD', 'CHF'];
const AUDJPY: CurrencyExchange = ['AUD', 'JPY'];
const AUDNZD: CurrencyExchange = ['AUD', 'NZD'];
const AUDUSD: CurrencyExchange = ['AUD', 'USD'];

const CADCHF: CurrencyExchange = ['CAD', 'CHF'];
const CADJPY: CurrencyExchange = ['CAD', 'JPY'];

const CHFJPY: CurrencyExchange = ['CHF', 'JPY'];

const EURAUD: CurrencyExchange = ['EUR', 'AUD'];
const EURCAD: CurrencyExchange = ['EUR', 'CAD'];
const EURCHF: CurrencyExchange = ['EUR', 'CHF'];
const EURGBP: CurrencyExchange = ['EUR', 'GBP'];
const EURJPY: CurrencyExchange = ['EUR', 'JPY'];
const EURNZD: CurrencyExchange = ['EUR', 'NZD'];
const EURUSD: CurrencyExchange = ['EUR', 'USD'];

const GBPAUD: CurrencyExchange = ['GBP', 'AUD'];
const GBPCAD: CurrencyExchange = ['GBP', 'CAD'];
const GBPCHF: CurrencyExchange = ['GBP', 'CHF'];
const GBPJPY: CurrencyExchange = ['GBP', 'JPY'];
const GBPNZD: CurrencyExchange = ['GBP', 'NZD'];
const GBPUSD: CurrencyExchange = ['GBP', 'USD'];

const NZDCAD: CurrencyExchange = ['NZD', 'CAD'];
const NZDCHF: CurrencyExchange = ['NZD', 'CHF'];
const NZDJPY: CurrencyExchange = ['NZD', 'JPY'];
const NZDUSD: CurrencyExchange = ['NZD', 'USD'];

const USDCAD: CurrencyExchange = ['USD', 'CAD'];
const USDCHF: CurrencyExchange = ['USD', 'CHF'];
const USDJPY: CurrencyExchange = ['USD', 'JPY'];

const fxProdIndicators: CurrencyExchange[] = [
  AUDCAD,
  AUDCHF,
  AUDJPY,
  AUDNZD,
  AUDUSD,
  CADCHF,
  CADJPY,
  CHFJPY,
  EURAUD,
  EURCAD,
  EURCHF,
  EURGBP,
  EURJPY,
  EURNZD,
  EURUSD,
  GBPAUD,
  GBPCAD,
  GBPCHF,
  GBPJPY,
  GBPNZD,
  GBPUSD,
  NZDCAD,
  NZDCHF,
  NZDJPY,
  NZDUSD,
  USDCAD,
  USDCHF,
  USDJPY
];

const fxTestIndicators = [
  USDCHF,
  USDJPY
];

const fxIndicators = fxProdIndicators;

const API_PROD_INTERVAL = 15;
const API_TEST_INTERVAL = 1;
const API_INTERVAL = API_PROD_INTERVAL;

const button = document.querySelector('button');
const mouseup$ = fromEvent(document, 'mouseup');
const click$ = fromEvent(button, 'click');
//.pipe( takeUntil(mouseup$) );

const apiInterval$ = timer(0, API_INTERVAL * 1000);
const fxIndicator$ = from(fxIndicators);

const clickFxInterval$ = click$.pipe(
  switchMap(_ => zip(apiInterval$, fxIndicator$))
);

const fxInterval$ = zip(apiInterval$, fxIndicator$);

/*
fxInterval$.subscribe(
  ([time, fx]) => console.log(`${time} ${fx}`),
  error => console.log(error),
  () => console.log('Done! Yay!')
  );
*/

const makeApiCall = (fx: CurrencyExchange) => {

  const fxRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fx[0]}&to_currency=${fx[1]}&apikey=${ALPHA_VANTAGE_API_KEY}`;

  return ajax.getJSON(fxRateUrl);

}

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB2Lrb2S9Svu4Y2pajBeepkQbFk6qlDP5I",
  authDomain: "auto-trader-c66fc.firebaseapp.com",
  databaseURL: "https://auto-trader-c66fc.firebaseio.com",
  projectId: "auto-trader-c66fc",
  storageBucket: "",
  messagingSenderId: "643352729277",
  appId: "1:643352729277:web:6273d3bfa2416957"
};

console.log('fb config set');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log('fb init app', firebase);

// Get a reference to the database service
var database = firebase.database();

console.log('fb get database', database);

const writeIndicator = (indicator: number) => {
  
  console.log('fb start write indicator');

  const newIndicatorRef = firebase.database().ref('indicators').push();

  console.log('fb push indicator');

  return newIndicatorRef.set({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    value: indicator
  });

}

const FACTOR = 1.0;

fxInterval$.pipe(
  mergeMap(([_, fx]) => makeApiCall(fx)),
  map(fxRateResp => {
          const fxRateObj = fxRateResp['Realtime Currency Exchange Rate'];
          if (fxRateObj['1. From_Currency Code'] === 'JPY' || 
              fxRateObj['3. To_Currency Code'] === 'JPY') {
            return fxRateObj['5. Exchange Rate'] / 100.0;
          } else {
            return fxRateObj['5. Exchange Rate'];
          }
        }
      ),
  tap(rate => console.log(rate)),
  reduce((rateAccumulated, currentRate) => rateAccumulated + Number(currentRate), 0),
  map(rateAccumulated => rateAccumulated * FACTOR),
  mergeMap(writeIndicator)
)
  .subscribe(
    result => console.log('result ', result),
    err => console.error(err),
    () => console.log('Done! Yay!')
  );


/*
click$
  .subscribe(
    result => console.log('result ', result),
    err => console.error(err),
    () => console.log('Done! Yay!')
  );
*/
