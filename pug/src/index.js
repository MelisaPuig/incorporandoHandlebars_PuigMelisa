const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const pug = require("pug");

const Contenedor = require("./Contenedor");

const TEMPLATER_ENGINE = "pug";

const PORT = process.env.PORT || 8080;

const PUBLIC_PATH = path.join(__dirname, "public");
const VIEWS_PATH = path.join(__dirname, "./views", TEMPLATER_ENGINE);
const LAYOUTS_PATH = path.join(VIEWS_PATH, "layouts");
const PARTIALS_PATH = path.join(VIEWS_PATH, "layouts");

const app = express();
const contenedor = new Contenedor();

app.use("/public", express.static(PUBLIC_PATH));

const routerProductos = require("./routerProductos");
app.use("/api/productos", routerProductos);

app.use(express.urlencoded({ extend: true }));
app.set(`views`, VIEWS_PATH);
app.set(`view engine`, TEMPLATER_ENGINE);

if (TEMPLATER_ENGINE === "hbs") {
  app.engine(
    `hbs`,
    handlebars.engine({
      extname: ".hbs",
      layoutsDir: LAYOUTS_PATH,
      partialsDir: PARTIALS_PATH,
    })
  );
}

app.get("/productos", async (req, res) => {
  const productos = await contenedor.getAll();
  const hayProductos = productos.length > 0;
  res.render("datos", { productos, hayProductos });
});

app.post("/productos", async (req, res) => {
  const { title, price, thumbnail } = req.body;
  let addedProduct;
  if (
    typeof title !== "undefined" &&
    typeof price !== "undefined" &&
    typeof thumbnail !== "undefined"
  ) {
    addedProduct = await contenedor.save(title, price, thumbnail);
  }
  res.redirect("/productos");
});

app.get("*", (req, res) => res.render("formulario"));

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on(`error`, (error) => console.log(`Este es el error ${error}`));
