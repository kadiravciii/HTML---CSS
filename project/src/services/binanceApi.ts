import axios from 'axios';

const BASE_URL = 'https://api.binance.com/api/v3';

export const fetchSymbols = async () => {
  const response = await axios.get(`${BASE_URL}/exchangeInfo`);
  return response.data.symbols
    .filter((symbol: any) => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT')
    .map((symbol: any) => symbol.symbol);
};

export const fetchKlines = async (symbol: string, interval: string, startTime?: number, endTime?: number) => {
  const params: any = {
    symbol,
    interval,
    limit: 1000,
  };

  if (startTime) params.startTime = startTime;
  if (endTime) params.endTime = endTime;

  const response = await axios.get(`${BASE_URL}/klines`, { params });
  return response.data.map((kline: any[]) => ({
    time: kline[0] / 1000,
    open: parseFloat(kline[1]),
    high: parseFloat(kline[2]),
    low: parseFloat(kline[3]),
    close: parseFloat(kline[4]),
    volume: parseFloat(kline[5]),
  }));
};