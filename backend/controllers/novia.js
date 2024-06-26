const createNovia = () => {
  const culo = Math.random() > 0.3 ? true : false;
  const tetas = !culo;
  const pinchila = Math.random() > 0.5 ? true : false;
  const novia = { culo, tetas, pinchila };

  console.log(
    `Felicidades Fede, creaste una novia ${
      pinchila ? `con` : `sin`
    } pinchila. Ahora podés seguir con tu vida tranquilo y feliz. ${
      culo
        ? `Además tiene un culo espectacular`
        : `No tiene culo, pero tiene tetas`
    }.`
  );
  return novia;
};
