const express = require(`express`);
const app = express();

const port = `3000`;

//middleware para parsear JSON;
app.use(express.json());

const indexRoutes = require(`./routes/index`);
app.use(`/api`, indexRoutes);

app.listen(port, () => {
  console.log(`Ta todo joya escuchando desde http://localhost:${port}`);
});
