import { news } from "./news";

export const A = {
  TEST: "TEST",
  INIT: "INIT",
  OPTIONS: "OPTIONS",
  SENTIMENT: "SENTIMENT",
  RONDA: "RONDA",
  SHOW: { trade: "showtrade", news: "shownews" },
  TOTALCAP: "TOTALCAP",
  TOTALCAPINDIVIDUAL: "TOTALCAPINDIVIDUAL",
  HISTORIALDINAMICO: "HISTORIALDINAMICO",
  MODIFICAR: {
    PRICE: "MODIFICAR_PRICE",
    PRICELIMIT: "MODIFICAR_PRICELIMIT",
    QUANTITY: "MODIFICAR_QUANTITY",
    LIQUIDITY: "MODIFICAR_LIQUIDITY",
    FOCUS: "MODIFICAR_FOCUS",
  },
  LIQ: {
    TOTAL: "LIQ_TOTAL",
    SENTIMENT: "LIQ_SENTIMENT",
  },
  TRADE: {
    cantidad: "TRADE_CANTIDAD",
    posicion: "TRADE_POSICION",
    accept: "TRADE_ACCEPT",
    costo: "TRADE_COSTO",
    finish: "TRADE-FINISH",
  },
  IMPACTONEWS: "IMPACTO-NEWS",
  TIME: { pausePlay: "PAUSEPLAY" },
  MARKET: { automatismo: "AUTOMATISMO", ejecucion: "EJECUCION" },
};

export const POSICION = {
  BUY: "BUY",
  SELL: "SELL",
  NULL: "NULL",
};
export const industryName = {
  Tech: "Tech",
  Health: "Health",
  Energy: "Energy",
};
export const SENTIMENT = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  NEUTRAL: "NEUTRAL",
};
const priceInicial = 100;
const quantityInicial = 10;

export const industryState = {
  price: priceInicial,
  quantity: quantityInicial,
  totalCapIndividual: priceInicial * quantityInicial,
  sentiment: SENTIMENT.NEUTRAL,
  historial: [100],
  flagUpdate: true,
  volatility: 0,
  direction: 10,
};

export const arrayVolatility2 = [
  "D6",
  "6 + D6",
  "10 + D6",
  "15 + D6",
  "20 + D10",
  "30 + 2D20",
];
export const arrayVolatility = [
  [1, 5],
  [6, 10],
  [11, 15],
  [16, 20],
  [21, 30],
  [31, 50],
];
