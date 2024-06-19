import React, { useReducer } from "react";
import {
  A,
  POSICION,
  SENTIMENT,
  industryName,
  industryState,
} from "./Organizador";

const estadoInicialIndustrias = Object.keys(industryName).reduce((acc, key) => {
  acc[key] = industryState;
  return acc;
}, {});

const estadoInicial = {
  rondas: 18,
  rondasAleatorias: 5,
  ronda: 7,
  show: {
    trade: false,
    tradeName: null,
    news: false,
  },
  cash: 10000,
  totalCap: 10000 + 3 * 1000,
  industry: estadoInicialIndustrias,
  focus: industryName.Tech,
  liq: {
    sentimiento: 0,
    adicional: 0,
    total: 0,
  },
  trade: {
    cantidad: 0,
    posicion: POSICION.NULL,
    cashFlow: 0,
    stockFlow: 0,
    costoTransaccion: 0,
  },
  news: [],
  time: {
    Pre: { minutos: 1, segundos: 0, flag: false },
    Open: { minutos: 2, segundos: 0, flag: false },
  },
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const calculateDirection = (historial) => {
  const diferenciaAlcista = 1.05;
  const diferenciaBajista = 0.95;
  if (historial.length < 4) return 0;
  const lastThree = historial.slice(-4, -1);
  if (
    lastThree[0] * diferenciaAlcista < lastThree[1] &&
    lastThree[1] * diferenciaAlcista < lastThree[2]
  ) {
    console.log(`Las three ${lastThree} = alcista`);
    return 1; // tendencia al alza
  } else if (
    lastThree[0] * diferenciaBajista > lastThree[1] &&
    lastThree[1] * diferenciaBajista > lastThree[2]
  ) {
    console.log(`Las three ${lastThree} = bajista`);
    return -1; // tendencia a la baja
  }
  return 0; // no hay tendencia clara
};

const reducer = (state, action) => {
  let newState = { ...state };

  const ac = action;
  const sh = state.show;
  const stech = state.industry.Tech;
  const shealth = state.industry.Health;
  const senergy = state.industry.Energy;
  const industria = state.industry[ac.name];
  const industriaFocus = state.industry[state.focus];
  const strade = state.trade;
  const sliq = state.liq;
  const cantidad = strade.cantidad < 0 ? strade.cantidad * -1 : strade.cantidad;

  switch (action.type) {
    case A.INIT:
      const indstrias = Object.keys(state.industry).reduce((acc, key) => {
        const ind = state.industry[key];
        let historialAleatorio = [getRandomInt(90, 110)];
        for (let i = 0; i < state.rondasAleatorias; i++) {
          const valor = getRandomInt(6, 20);
          const signo = getRandomInt(0, 2) === 0 ? -1 : 1;
          historialAleatorio.push(historialAleatorio[i] + valor * signo);
        }
        acc[key] = {
          ...ind,
          historial: historialAleatorio,
          price: historialAleatorio[historialAleatorio.length - 1],
        };
        return acc;
      }, {});

      return { ...state, industry: indstrias };
    // Modifica el ultimo dato historico por el precio actual, si flagUpdate es true, agrega el precio actual al historial.
    case A.HISTORIALDINAMICO:
      const historial = state.industry[ac.ind].historial;
      const precioActual = state.industry[ac.ind].price;
      let historialActualizado = historial;
      if (state.industry[ac.ind].flagUpdate) {
        historialActualizado = [...historial, precioActual];
      } else {
        historialActualizado[historial.length - 1] = precioActual;
      }
      return {
        ...state,
        industry: {
          ...state.industry,
          [ac.ind]: {
            ...state.industry[ac.ind],
            historial: historialActualizado,
            flagUpdate: false,
          },
        },
      };

    case A.TEST:
      return { ...state };
    case A.RONDA:
      let confirmacion = true;
      if (!ac.update) {
        confirmacion = window.confirm(`Do you want to pass to the next round?`);
      }
      if (confirmacion) {
        const industryKeys = Object.keys(industryName); // Obtener las claves de las industrias
        let precios = [
          state.industry.Tech.price,
          state.industry.Health.price,
          state.industry.Energy.price,
        ];

        industryKeys.forEach((key, i) => {
          const priceUpdate = window.prompt(`Update price of ${key}`);
          precios[i] =
            isNaN(priceUpdate) || priceUpdate === null
              ? precios[i]
              : parseFloat(priceUpdate);
        });

        const updateHistory = (industria, nuevoPrecio) => {
          let historial = state.industry[industria].historial;
          const flagUpdate = state.industry[industria].flagUpdate;
          if (flagUpdate) {
            return [...historial, nuevoPrecio];
          } else {
            historial[historial.length - 1] = nuevoPrecio;
            return historial;
          }
        };

        const newHistoryTech = updateHistory(industryName.Tech, precios[0]);
        const newHistoryHealth = updateHistory(industryName.Health, precios[1]);
        const newHistoryEnergy = updateHistory(industryName.Energy, precios[2]);

        console.log(`nuevo historial: ${newHistoryTech}`);
        return {
          ...state,
          ronda: ac.update ? state.ronda : state.ronda + 1,
          industry: {
            ...state.industry,
            Tech: {
              ...state.industry.Tech,
              price: precios[0],
              historial: ac.update ? stech.historial : newHistoryTech,
              flagUpdate: confirmacion && !ac.update ? true : false,
            },
            Health: {
              ...state.industry.Health,
              price: precios[1],
              historial: ac.update ? shealth.historial : newHistoryHealth,
              flagUpdate: confirmacion && !ac.update ? true : false,
            },
            Energy: {
              ...state.industry.Energy,
              price: precios[2],
              historial: ac.update ? senergy.historial : newHistoryEnergy,
              flagUpdate: confirmacion && !ac.update ? true : false,
            },
          },
        };
      } else {
        return { ...state };
      }

    case A.SHOW.trade:
      //   console.log("hola" + ac.show);
      return { ...state, show: { ...sh, trade: ac.show, tradeName: ac.name } };
    case A.SENTIMENT:
      const nuevoSentimiento =
        industria.sentiment === SENTIMENT.NEUTRAL
          ? SENTIMENT.POSITIVE
          : industria.sentiment === SENTIMENT.POSITIVE
          ? SENTIMENT.NEGATIVE
          : SENTIMENT.NEUTRAL;
      return {
        ...state,
        industry: {
          ...state.industry,
          [ac.name]: { ...industria, sentiment: nuevoSentimiento },
        },
      };
    case A.TOTALCAP:
      const totalCap =
        state.cash +
        stech.totalCapIndividual +
        shealth.totalCapIndividual +
        senergy.totalCapIndividual;
      return { ...state, totalCap };

    case A.TOTALCAPINDIVIDUAL:
      const totalCapIndividual = industria.price * industria.quantity;
      return {
        ...state,
        industry: {
          ...state.industry,
          [ac.name]: { ...industria, totalCapIndividual },
        },
      };

    case A.MODIFICAR.PRICE:
      // mensaje en el que se pueda ingresar el nuevo precio
      const nuevoPrecio = parseInt(window.prompt("Ingrese el nuevo precio"));
      return {
        ...state,
        industry: {
          ...state.industry,
          [ac.name]: {
            ...industria,
            price: nuevoPrecio >= 0 ? nuevoPrecio : industria.price,
          },
        },
      };
    case A.MODIFICAR.PRICELIMIT:
      const industry = Object.keys(newState.industry).forEach((key) => {
        const industria = newState.industry[key];
        industria.price = Math.max(industria.price, 0);
      });
      return newState;

    case A.MODIFICAR.QUANTITY:
      // mensaje en el que se pueda ingresar la nueva cantidad
      const nuevaCantidad = parseInt(
        window.prompt("Ingrese la nueva cantidad")
      );
      return {
        ...state,
        industry: {
          ...state.industry,
          [ac.name]: {
            ...industria,
            quantity: nuevaCantidad >= 0 ? nuevaCantidad : industria.quantity,
          },
        },
      };
    case A.MODIFICAR.LIQUIDITY:
      const nuevaLiquidez = parseInt(
        window.prompt("Ingrese la nueva liquidez")
      );
      return {
        ...state,
        liq: {
          ...state.liq,
          adicional: nuevaLiquidez >= 0 ? nuevaLiquidez : state.liq.adicional,
        },
      };
    case A.LIQ.TOTAL:
      const totalLiquidez = state.liq.sentimiento + state.liq.adicional;
      return { ...state, liq: { ...state.liq, total: totalLiquidez } };

    case A.LIQ.SENTIMENT:
      let minimoLiq = 1;
      let maximoLiq = 2;
      if (industriaFocus.sentiment === SENTIMENT.NEUTRAL) {
      } else if (industriaFocus.sentiment === SENTIMENT.POSITIVE) {
        if (strade.posicion === POSICION.BUY) {
          minimoLiq = 0;
          maximoLiq = 2;
        } else if (strade.posicion === POSICION.SELL) {
          minimoLiq = 1;
          maximoLiq = 3;
        }
      } else if (industriaFocus.sentiment === SENTIMENT.NEGATIVE) {
        if (strade.posicion === POSICION.BUY) {
          minimoLiq = 1;
          maximoLiq = 3;
        } else if (strade.posicion === POSICION.SELL) {
          minimoLiq = 0;
          maximoLiq = 2;
        }
      }
      const liquidez = getRandomInt(minimoLiq, maximoLiq);
      return { ...state, liq: { ...state.liq, sentimiento: liquidez } };

    case A.MODIFICAR.FOCUS:
      return {
        ...state,
        focus: ac.name,
        liq: { ...state.liq, adicional: 0 },
        trade: { ...strade, cantidad: 0, posicion: POSICION.NULL },
      };

    case A.TRADE.cantidad:
      const nuevoValor = parseInt(strade.cantidad + ac.valor);
      const nuevaPosicion = nuevoValor > 0 ? POSICION.BUY : POSICION.SELL;
      return {
        ...state,
        trade: { ...strade, cantidad: nuevoValor, posicion: nuevaPosicion },
      };

    case A.TRADE.costo:
      const cantidadTransaccion = cantidad > sliq.total ? sliq.total : cantidad;
      const posicion = strade.posicion;
      const costoTotal =
        posicion === POSICION.SELL || posicion === POSICION.NULL
          ? cantidadTransaccion * industriaFocus.price
          : -cantidadTransaccion * industriaFocus.price;
      console.log(`posicion = ${posicion}`);
      return { ...state, trade: { ...strade, costoTransaccion: costoTotal } };

    case A.TRADE.accept:
      const cantidadMayor = cantidad > sliq.total ? true : false;
      const newQ = cantidadMayor
        ? strade.posicion === POSICION.SELL
          ? -(cantidad - sliq.total)
          : cantidad - sliq.total
        : 0;
      const newLA = 0;
      let newP = cantidadMayor
        ? strade.posicion === POSICION.BUY
          ? industriaFocus.price + 1
          : industriaFocus.price - 1
        : industriaFocus.price;
      let promedioLiquidez = strade.posicion === POSICION.SELL ? 1 : -1;

      if (!cantidadMayor) {
        //calculo de liquidez restante + nuevo precio rebotado por la misma
        const liqRestante = sliq.total - cantidad;
        console.log(
          `la liquidez es mayor a la cantidad a tradear, variacion de precio segun liquidez. Liquidez restante = ${liqRestante}`
        );

        if (industriaFocus.sentiment !== SENTIMENT.NEUTRAL) {
          switch (strade.posicion) {
            case POSICION.BUY:
              promedioLiquidez =
                industriaFocus.sentiment === SENTIMENT.POSITIVE ? -2 : -0.75;
              break;
            case POSICION.SELL:
              promedioLiquidez =
                industriaFocus.sentiment === SENTIMENT.POSITIVE ? 0.75 : 2;
              break;
            default:
              break;
          }
        }
        const variacionP = Math.floor(liqRestante / promedioLiquidez);
        console.log(
          `variacion de precio por exceso de liquidez = ${variacionP}`
        );
        newP = industriaFocus.price + variacionP;
      }
      const cashFlow = strade.cashFlow + strade.costoTransaccion;
      const stockFlow = strade.stockFlow + (strade.cantidad - newQ);
      return {
        ...state,
        liq: { ...sliq, adicional: 0 },
        industry: {
          ...state.industry,
          [state.focus]: { ...industriaFocus, price: newP },
        },
        trade: { ...strade, cantidad: newQ, cashFlow, stockFlow },
      };
    case A.TRADE.finish:
      // variar cash y stocks segun flows
      // reset flows
      const newQuantity = industriaFocus.quantity + strade.stockFlow;
      const newCash = state.cash + strade.cashFlow;
      return {
        ...state,
        industry: {
          ...state.industry,
          [state.focus]: { ...industriaFocus, quantity: newQuantity },
        },
        cash: newCash,
        trade: { ...strade, cashFlow: 0, stockFlow: 0 },
      };
    // const nuevoSentimientoLiquidez =
    case A.SHOW.news:
      console.log(`muestra news`);
      return { ...state, show: { ...sh, news: ac.show } };

    case A.IMPACTONEWS:
      const { listaNews } = action;
      newState.news = listaNews;

      // Reiniciar volatilidad y dirección a 0
      Object.keys(newState.industry).forEach((industryKey) => {
        newState.industry[industryKey].volatility = 0;
        newState.industry[industryKey].direction = 10;
      });

      // Sumar los valores de las noticias
      // Establecer limites inferiores y superiores de volatilidad y direccion
      listaNews.forEach((newsItem) => {
        const { industry, volatility, direction } = newsItem;
        newState.industry[industry].volatility = Math.min(
          Math.max(newState.industry[industry].volatility + volatility, 0),
          5
        );
        newState.industry[industry].direction = Math.min(
          Math.max(newState.industry[industry].direction + direction, 0),
          20
        );
      });

      // Ajustes adicionales según el sentimiento y los movimientos de precios
      Object.keys(newState.industry).forEach((industryKey) => {
        const industry = newState.industry[industryKey];

        // Ajustar según el sentimiento
        //si la direccion es extrema y el sentimiento es neutro, cambia sentimiento.
        if (industry.sentiment === SENTIMENT.POSITIVE) {
          industry.volatility = Math.min(industry.volatility + 1, 5);
          industry.direction = Math.max(industry.direction - 1, 0);
        } else if (industry.sentiment === SENTIMENT.NEGATIVE) {
          industry.volatility = Math.min(industry.volatility + 1, 5);
          industry.direction = Math.min(industry.direction + 1, 20);
        } else if (industry.sentiment === SENTIMENT.NEUTRAL) {
          if (industry.direction <= 5) {
            industry.sentiment = SENTIMENT.POSITIVE;
          } else if (industry.direction >= 15) {
            industry.sentiment = SENTIMENT.NEGATIVE;
          }
        }

        // Ajustar según los últimos 3 movimientos de precios
        const directionAdjustment = calculateDirection(industry.historial);
        if (directionAdjustment !== 0) {
          industry.direction = Math.min(
            Math.max(industry.direction + directionAdjustment * 3, 0),
            20
          );
        }
      });

      return newState;

    case A.TIME.pausePlay:
      return {
        ...state,
        time: {
          ...state.time,
          [ac.nombre]: {
            ...state.time[ac.nombre],
            flag: !state.time[ac.nombre].flag,
          },
        },
      };
    default:
      return { ...state };
  }
};

export const useGeneralReducer = () => {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  return [state, dispatch];
};
