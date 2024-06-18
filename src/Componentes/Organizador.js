import { news } from "./news";

export const A = {
  TEST: "TEST",
  INIT: "INIT",
  SENTIMENT: "SENTIMENT",
  RONDA: "RONDA",
  SHOW: { trade: "showtrade", news: "shownews" },
  TOTALCAP: "TOTALCAP",
  TOTALCAPINDIVIDUAL: "TOTALCAPINDIVIDUAL",
  HISTORIALDINAMICO: "HISTORIALDINAMICO",
  MODIFICAR: {
    PRICE: "MODIFICAR_PRICE",
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

export const arrayVolatility = [
  "D6",
  "3 + D6",
  "5 + D10",
  "8 + D12",
  "15 + D20",
  "10 + D20 + D20",
];
