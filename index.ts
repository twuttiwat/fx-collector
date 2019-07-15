import { of, from, timer, zip } from 'rxjs';
import { map, mergeMap, tap, first, take } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

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

const fxIndicators: CurrencyExchange[] = [
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
/*
zip( timer(0, 1 * 1000), from(fxIndicators) )
.subscribe(
  ([time, fx]) => console.log(`${time} ${fx}`),
  e => console.error(e),
  () => console.log('Done! Yay!')
  );
*/

zip(timer(0, 20 * 1000), from(fxIndicators)).pipe(
  //tap(console.log),
  //take(2),
  mergeMap(([_, fx]) => {

    const fxRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fx[0]}&to_currency=${fx[1]}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    return ajax.getJSON(fxRateUrl)

  }),
  //tap(console.log),
  map(fxRateResp => fxRateResp['Realtime Currency Exchange Rate'])
);
/*
  .subscribe(
    fxRate => console.log(fxRate),
    err => console.error(err),
    () => console.log('Done! Yay!')
  );
  */

