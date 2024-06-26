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
    isNaN(promtPrecio) || promtPrecio === null || promtPrecio.trim() === ""
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
return {
  ...state,
  industry: newIndustry,
  ronda: state.ronda + !ac.update ? 1 : 0,
  time: { ...state.time, Pre: { ...state.time.Pre, flag: true } },
};

///codigo antiguo
// let confirmacion = true;
//       if (!ac.update) {
//         confirmacion = window.confirm(`Do you want to pass to the next round?`);
//       }
//       if (!confirmacion) {
//         return state;
//       }
//       const industryKeys = Object.keys(industryName); // Obtener las claves de las industrias
//       let precios = [stech.price, shealth.price, senergy.price];
//       const preciosPrevios = precios;

//       industryKeys.forEach((key, i) => {
//         const priceUpdate = window.prompt(`Update price of ${key}`);
//         precios[i] =
//           isNaN(priceUpdate) ||
//           priceUpdate === null ||
//           priceUpdate.trim() === ""
//             ? precios[i]
//             : parseFloat(priceUpdate);
//       });

//       const updateHistory = (industria, nuevoPrecio) => {
//         let historial = state.industry[industria].historial;
//         const flagUpdate = state.industry[industria].flagUpdate;
//         const openMarket = state.time.Open.flag;
//         //por que lo condiciono con el open market?
//         if (flagUpdate && !ac.update) {
//           return [...historial, nuevoPrecio];
//         } else {
//           historial[historial.length - 1] = nuevoPrecio;
//           return historial;
//         }
//       };

//       const newHistoryTech = updateHistory(industryName.Tech, precios[0]);
//       const newHistoryHealth = updateHistory(industryName.Health, precios[1]);
//       const newHistoryEnergy = updateHistory(industryName.Energy, precios[2]);

//       console.log(`nuevo historial: ${newHistoryTech}`);
//       return {
//         ...state,
//         ronda: ac.update ? state.ronda : state.ronda + 1,
//         time: { ...state.time, Pre: { ...state.time.Pre, flag: true } },
//         industry: {
//           ...state.industry,
//           Tech: {
//             ...state.industry.Tech,
//             price: precios[0],
//             historial: ac.update ? stech.historial : newHistoryTech,
//             flagUpdate:
//               confirmacion && !ac.update && precios[0] === preciosPrevios[0]
//                 ? true
//                 : false,
//           },
//           Health: {
//             ...state.industry.Health,
//             price: precios[1],
//             historial: ac.update ? shealth.historial : newHistoryHealth,
//             flagUpdate:
//               confirmacion && !ac.update && precios[1] === preciosPrevios[1]
//                 ? true
//                 : false,
//           },
//           Energy: {
//             ...state.industry.Energy,
//             price: precios[2],
//             historial: ac.update ? senergy.historial : newHistoryEnergy,
//             flagUpdate:
//               confirmacion && !ac.update && precios[2] === preciosPrevios[2]
//                 ? true
//                 : false,
//           },
//         },
//       };
