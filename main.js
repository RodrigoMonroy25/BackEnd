const fs = require("fs");
const express = require("express");
const { Router } = express;
const app = express();
const router = Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
//const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use("/api", router);
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const createFile = fs.writeFileSync("./productos.json", "[]");
const readFile = fs.readFileSync("./productos.json", "utf-8");
const productList = JSON.parse(readFile);
class Contenedor {
  constructor(title, price, thumbnail) {
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
    this.id = 1;
  }

  save(product) {
    product.id = productList.length + 1;
    productList.push(product);
    try {
      fs.writeFileSync("./productos.json", JSON.stringify(productList));
      console.log(
        `Producto "${product.title}" agregado con éxito, id: ${product.id}`
      );
    } catch {
      console.log(`Ha ocurrido un error al sobreescribir el archivo JSON`);
    }
  }

  geyById(id) {
    let idToSearch = id - 1;
    if (idToSearch <= productList.length) {
      let result = productList[idToSearch];
      console.log(result);
    } else {
      return console.log(`No se encontró el id ingresado`);
    }
  }

  getAll() {
    return console.log(productList);
  }

  deleteById(id) {
    let idToDelete = id - 1;
    if (idToDelete <= productList.length) {
      delete productList[idToDelete];
      fs.writeFileSync("./productos.json", JSON.stringify(productList));
      return console.log(`Se ha borrado el producto id ${id}`);
    } else {
      return console.log(`No se encontró el id ingresado`);
    }
  }

  deleteAll() {
    try {
      productList.splice(0, productList.length);
      fs.writeFileSync("./productos.json", JSON.stringify(productList));
      return console.log(`Se han borrado todos los productos de la lista`);
    } catch {
      console.log(`Ha ocurrido un error al borrar los productos de la lista`);
    }
  }
}
let genericProduct = new Contenedor("Product title", 0, "Thumbnail.jpg");

// Se crea y configura el servidor para que escuche un determinado puerto
const server = app.listen(PORT, () => {
  console.log(`App Express escuchando en el puerto ${server.address().port}`);
});
// Función para el manejo de errores del servidor
server.on("Error", (error) =>
  console.log(`Ocurrió el siguiente error: ${error}`)
);
//
app.get("/", (request, response) => {
  response.send(
    '<h1 style="color:0000"> Bienvenidos al servidor Express </h1>'
  );
});
app.get("/productos", (request, response) => {
  response.json(productList.map((product) => product.title));
});
app.get("/RandomProduct", (request, response) => {
  let randomNumber = Math.round(Math.random() * productList.length);
  let randomItem = productList[randomNumber];
  response.json(randomItem);
});

router.get("/productos", (request, response) => {
  if (productList.length > 1) {
    genericProduct.getAll();
    response.json(productList.map((product) => product.title));
  } else {
    response.send(`La lista de productos se encuentra vacía`);
  }
});

router.get("/productos/:id", (request, response) => {
  let id = request.params.id - 1;
  if (id >= productList.length || id < 0) {
    response.send("Ha ingresado un número fuera de rango");
  } else if (isNaN(id)) {
    response.send("El carácter ingresado no es un número");
  } else if (productList[id] == null) {
    response.send(`El id ${request.params.id} fue borrado, elija otro id`);
  } else {
    genericProduct.geyById(request.params.id);
    response.json(productList[id]);
  }
});

router.post("/productos", jsonParser, (request, response) => {
  let product = new Contenedor(
    request.body.title,
    request.body.price,
    request.body.thumbnail
  ); // !!! Modificar con HTML para agregar productos
  if (productList) {
    product.save(product);
    response.json(productList);
  } else {
    const createFile = fs.writeFileSync("./productos.json", "[]");
    const readFile = fs.readFileSync("./productos.json", "utf-8");
    const productList = JSON.parse(readFile);
    product.save(product);
    response.json(productList);
  }
});

router.put("/productos/:id", jsonParser, (request, response) => {
  let id = request.params.id - 1;
  let product = new Contenedor(
    request.body.title,
    request.body.price,
    request.body.thumbnail
  ); // !!! Modificar con HTML para agregar productos
  if (id >= productList.length || id < 0) {
    response.send("Ha ingresado un número fuera de rango");
  } else if (isNaN(id)) {
    response.send("El carácter ingresado no es un número");
  } else if (productList[id] == null) {
    response.send(`El id ${request.params.id} fue borrado, no puede ser editado, elija otro id`);
  } else {
    productList[id] = product;
    productList[id].id = parseInt(request.params.id);
    console.log(
      `El id ${request.params.id} fue sobreescrito con el producto "${product.title}"`
    );
    response.json(productList);
  }
});

router.delete("/productos/:id", (request, response) => {
  let id = request.params.id;
  genericProduct.deleteById(id);
  response.json(productList);
});

const exampleProduct = new Contenedor(
  "Microondas",
  100,
  "ImagenMicroondas.jpg"
);
const exampleProduct2 = new Contenedor("Heladera", 200, "ImagenHeladera.jpg");
const exampleProduct3 = new Contenedor("Notebook", 300, "ImagenNotebook.jpg");

genericProduct.save(exampleProduct);
genericProduct.save(exampleProduct2);
genericProduct.save(exampleProduct3);
