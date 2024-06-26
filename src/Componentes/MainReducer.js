import React, { useReducer } from "react";
import {
  A,
  POSICION,
  SENTIMENT,
  industryName,
  industryState,
  arrayVolatility,
} from "./Organizador";

const estadoInicialIndustrias = Object.keys(industryName).reduce((acc, key) => {
  acc[key] = industryState;
  return acc;
}, {});

const estadoInicial = {
  rondas: 18,
  rondasAleatorias: 6,
  ronda: 7,
  show: {
    trade: false,
    ordenes: false,
    stops: false,
    tradeName: null,
    news: false,
    cantidadNews: 6,
  },
  cash: 100000,
  totalCap: 100000 + 3 * 3000,
  industry: estadoInicialIndustrias,
  focus: industryName.Tech,
  liq: {
    sentimiento: 0,
    adicional: 0,
    total: 0,
    fondoMin: 5,
    fondoMax: 10,
  },
  trade: {
    cantidad: 0,
    posicion: POSICION.NULL,
    cashFlow: 0,
    stockFlow: 0,
    costoTransaccion: 0,
  },
  news: [],
  ordenes: { market: [], limit: [] },
  time: {
    Pre: { minutos: 0, segundos: 15, flag: false },
    Open: { minutos: 0, segundos: 30, flag: false },
    news: {
      minimo: { minutos: 0, segundos: 10 },
      maximo: { minutos: 0, segundos: 20 },
    },
  },
  market: { auto: true, intervaloMinimo: 20000, intervaloMaximo: 2 },
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const calculoLiquidezFondo = (sentimiento, posicion) => {
  const factor =
    sentimiento === SENTIMENT.POSITIVE
      ? posicion === POSICION.BUY
        ? 0.5
        : 1.5
      : sentimiento === SENTIMENT.NEGATIVE
      ? posicion === POSICION.BUY
        ? 1.5
        : 0.5
      : 1;
  const minLiq = Math.floor(estadoInicial.liq.fondoMin * factor);
  const maxLiq = Math.floor(estadoInicial.liq.fondoMax * factor);
  const arrayLiq = [minLiq, maxLiq];
  return arrayLiq;
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

const calculateDirectionV2 = (historial) => {
  const rangoCalculo = historial.length < 5 ? historial.length : 5;
  let diferenciaAcumulativa = 0;
  for (let i = 1; i <= rangoCalculo; i++) {
    const antes = historial[historial.length - (i + 2)];
    const despues = historial[historial.length - (i + 1)];
    diferenciaAcumulativa += Math.min(
      Math.floor(((despues - antes) / antes) * 100),
      60
    );
  }
  const direccion = Math.floor(diferenciaAcumulativa / 10);
  return direccion;
};
const newsSpeedMapping = {
  1: [1, 0, 2, 0],
  2: [0, 45, 1, 30],
  3: [0, 30, 1, 0],
  4: [0, 10, 0, 20],
  default: [0, 45, 1, 30],
};

const MARKET_INTERVAL_BASE = 20000;
const MARKET_INTERVAL_FACTOR = 3000;

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

      return {
        ...state,
        industry: indstrias,
        time: { ...state.time, Pre: { ...state.time.Pre, flag: true } },
      };
    case A.OPTIONS:
      const { options } = action;
      const { marketAuto, marketSpeed, newsSpeed, newsShow, arrayMarketTimes } =
        options;

      const arrayNewsSpeed =
        newsSpeedMapping[parseInt(newsSpeed)] || newsSpeedMapping.default;

      return {
        ...state,
        market: {
          ...state.market,
          auto: marketAuto,
          intervaloMaximo: marketSpeed,
          intervaloMinimo: Math.floor(
            MARKET_INTERVAL_BASE - marketSpeed * MARKET_INTERVAL_FACTOR
          ),
        },
        time: {
          ...state.time,
          news: {
            ...state.time.news,
            minimo: { minutos: arrayNewsSpeed[0], segundos: arrayNewsSpeed[1] },
            maximo: { minutos: arrayNewsSpeed[2], segundos: arrayNewsSpeed[3] },
          },
          Pre: {
            ...state.time.Pre,
            minutos: arrayMarketTimes[0],
            segundos: arrayMarketTimes[1],
          },
          Open: {
            ...state.time.Open,
            minutos: arrayMarketTimes[2],
            segundos: arrayMarketTimes[3],
          },
        },
        show: {
          ...state.show,
          cantidadNews: newsShow,
        },
      };
    // Modifica el ultimo dato historico por el precio actual, si flagUpdate es true, agrega el precio actual al historial.

    case A.HISTORIALDINAMICO:
      const precioActual = state.industry[ac.ind].price;
      let historialActualizado = [...state.industry[ac.ind].historial];
      historialActualizado[historialActualizado.length - 1] = precioActual;

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

    case A.RONDA:
      let confirmacion = true;
      if (!ac.update) {
        confirmacion = window.confirm(`Do you want to pass to the next round?`);
      }
      if (!confirmacion) {
        return state;
      }
      const newIndustry = Object.keys(state.industry).reduce((acc, key) => {
        const industria = state.industry[key];
        let historial = [...industria.historial];
        const promtPrecio = window.prompt(`Update price of ${key}`);
        const nuevoPrecio =
          isNaN(promtPrecio) ||
          promtPrecio === null ||
          promtPrecio.trim() === ""
            ? industria.price
            : parseFloat(promtPrecio);
        historial[historial.length - 1] = nuevoPrecio;

        if (!ac.update) {
          historial = [...historial, nuevoPrecio];
        }

        const nuevaIndustria = {
          ...industria,
          price: nuevoPrecio,
          historial,
          flagUpdate: !ac.update ? true : false,
        };
        acc[key] = nuevaIndustria;
        return acc;
      }, {});

      const modificadorRonda = !ac.update ? 1 : 0;

      return {
        ...state,
        industry: newIndustry,
        ronda: state.ronda + modificadorRonda,
        time: { ...state.time, Pre: { ...state.time.Pre, flag: true } },
      };

    case A.SHOW.trade:
      //   console.log("hola" + ac.show);
      return { ...state, show: { ...sh, trade: ac.show, tradeName: ac.name } };
    case A.SHOW.ordenes:
      return { ...state, show: { ...sh, ordenes: ac.show } };
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
      const arrayLiq = calculoLiquidezFondo(
        industriaFocus.sentiment,
        strade.posicion
      );
      const liquidez = getRandomInt(arrayLiq[0], arrayLiq[1]);
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
      return { ...state, trade: { ...strade, costoTransaccion: costoTotal } };

    case A.TRADE.accept:
      const cantidadMayor = cantidad > sliq.total ? true : false;
      const newQ = cantidadMayor
        ? strade.posicion === POSICION.SELL
          ? -(cantidad - sliq.total)
          : cantidad - sliq.total
        : 0;
      let newP = cantidadMayor
        ? strade.posicion === POSICION.BUY
          ? industriaFocus.price + 1
          : industriaFocus.price - 1
        : industriaFocus.price;
      let promedioLiquidez = strade.posicion === POSICION.SELL ? 1 : -1;

      if (!cantidadMayor) {
        //calculo de liquidez restante + nuevo precio rebotado por la misma
        const liqRestante = sliq.total - cantidad;

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

        newP = industriaFocus.price + variacionP;
      }
      const cashFlow = strade.cashFlow + strade.costoTransaccion;
      const stockFlow = strade.stockFlow + (strade.cantidad - newQ);
      return {
        ...state,
        cash: state.cash + strade.costoTransaccion,
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
      return {
        ...state,
        industry: {
          ...state.industry,
          [state.focus]: { ...industriaFocus, quantity: newQuantity },
        },
        trade: { ...strade, cashFlow: 0, stockFlow: 0 },
      };
    case A.TRADE.stops:
      const { stop } = ac;
      const stops = [...state.industry[state.focus].stops, stop];
      return {
        ...state,
        industry: {
          ...state.industry,
          [state.focus]: { ...state.industry[state.focus], stops },
        },
      };
    case A.TRADE.clearStops:
      const { objetivo } = ac;
      const nuevoArrayStops =
        objetivo === "all"
          ? []
          : state.industry[state.focus].stops.filter(
              (stop) => stop !== objetivo
            );
      return {
        ...state,
        industry: {
          ...state.industry,
          [state.focus]: {
            ...state.industry[state.focus],
            stops: nuevoArrayStops,
          },
        },
      };
    // const nuevoSentimientoLiquidez =
    case A.SHOW.news:
      console.log(`muestra news`);
      return { ...state, show: { ...sh, news: ac.show } };
    case A.SHOW.stops:
      console.log(`muestra stops`);
      return { ...state, show: { ...sh, stops: ac.show } };

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
        const directionAdjustment = calculateDirectionV2(industry.historial);
        if (directionAdjustment !== 0) {
          industry.direction = Math.min(
            Math.max(industry.direction + directionAdjustment, 0),
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
            flag: ac.flag,
          },
        },
      };
    case A.MARKET.automatismo:
      return {
        ...state,
        market: { ...state.market, auto: ac.auto },
      };
    // si auto es true, se ejecuta automaticamente cada un tiempo determinnado definido en provider
    case A.MARKET.ejecucion:
      Object.keys(newState.industry).forEach((key) => {
        const industria = newState.industry[key];
        const precioActual = industria.price;
        const volatilidad = industria.volatility;
        const direccion = industria.direction;

        const variacion =
          getRandomInt(
            arrayVolatility[volatilidad][0],
            arrayVolatility[volatilidad][1]
          ) / 100;
        const direccionVariacion = getRandomInt(0, 20) <= direccion ? -1 : 1;
        const nuevoPrecio = Math.floor(
          precioActual * (1 + variacion * direccionVariacion)
        );
        newState.industry[key].price = nuevoPrecio;
        newState.industry[key].flagUpdate = false;
      });

      return newState;

    case A.ORDENES.nueva:
      const { industryOrden, posicionOrden, quantity, type } = ac.orden;
      const id = state.ordenes[type].length;
      const nuevaOrden = {
        id: id,
        nombre: industryOrden,
        posicion: posicionOrden,
        cantidad: quantity,
        type: type,
      };

      return {
        ...state,
        ordenes: {
          ...state.ordenes,
          [type]: [...state.ordenes[type], { ...nuevaOrden }],
        },
      };
    case A.ORDENES.ejecutar:
      const { indice, position, cant } = ac;
      // newState.show.trade = true;
      // newState.focus = ind;
      newState.trade.cantidad = position === POSICION.BUY ? cant : -cant;
      newState.trade.posicion = position;
      const nuevaListaOrden = state.ordenes.market.filter(
        (_, i) => i !== indice
      );
      return {
        ...newState,
        ordenes: {
          ...newState.ordenes,
          market: nuevaListaOrden,
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
