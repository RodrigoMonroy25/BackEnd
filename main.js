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
    if (id > productList.length || id < 1) {
      return console.log(`Ha ingresado un número fuera de rango`);
    } else if (isNaN(id)) {
      return console.log(`El carácter ingresado no es un número`);
    } else if (productList[idToSearch] == null) {
      console.log(`El id ${id} fue borrado`);
    } else {
      let result = productList[idToSearch];
      console.log(result);
    }
  }

  getAll() {
    if (productList.length < 1) {
      return console.log(`La lista de productos está vacía`);
    } else {
      return console.log(productList.map((product) => product.title));
    }
  }

  deleteById(id) {
    let idToDelete = id - 1;
    if (id > productList.length || id < 1) {
      return console.log(`Ha ingresado un número fuera de rango`);
    } else if (isNaN(id)) {
      return console.log(`El carácter ingresado no es un número`);
    } else if (productList[idToDelete] == null) {
      console.log(`El id ${id} ya fue borrado anteriormente`);
    } else {
      delete productList[idToDelete];
      fs.writeFileSync("./productos.json", JSON.stringify(productList));
      return console.log(`Se ha borrado el producto id ${id}`);
    }
  }

  deleteAll() {
    if (productList.length < 1) {
      console.log(`La lista de productos está vacía`);
    } else {
      try {
        productList.splice(0, productList.length);
        fs.writeFileSync("./productos.json", JSON.stringify(productList));
        return console.log(`Se han borrado todos los productos de la lista`);
      } catch {
        console.log(`Ha ocurrido un error al borrar los productos de la lista`);
      }
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

app.get("/", (request, response) => {
  response.send(
    '<h1 style="color:0000"> Bienvenidos al servidor Express </h1>'
  );
});

app.get("/productos", (request, response) => {
  if (productList < 0) {
    response.send(`La lista de productos está vacía`);
  } else {
    response.json(productList.map((product) => product.title));
  }
});

app.get("/RandomProduct", (request, response) => {
  if (productList.length < 1) {
    response.send(`La lista de productos está vacía`);
  } else {
    let randomNumber = Math.round(Math.random() * productList.length);
    let randomItem = productList[randomNumber];
    response.json(randomItem);
  }
});

router.get("/productos", (request, response) => {
  if (productList.length < 1) {
    response.send(`La lista de productos se encuentra vacía`);
  } else {
    genericProduct.getAll();
    response.json(productList.map((product) => product.title));
  }
});

router.get("/productos/:id", (request, response) => {
  let id = request.params.id;
  if (id > productList.length || id < 1) {
    response.send("Ha ingresado un número fuera de rango");
  } else if (isNaN(id)) {
    response.send("El carácter ingresado no es un número");
  } else if (productList[id - 1] == null) {
    response.send(`El id ${id} fue borrado, elija otro id`);
  } else {
    genericProduct.geyById(id);
    response.json(productList[id - 1]);
  }
});

router.post("/productos", jsonParser, (request, response) => {
  let product = new Contenedor(
    request.body.title,
    request.body.price,
    request.body.thumbnail
  ); // !!! Modificar con HTML para agregar productos
  product.save(product);
  response.json(productList);
});

router.put("/productos/:id", jsonParser, (request, response) => {
  let id = request.params.id;
  let product = new Contenedor(
    request.body.title,
    request.body.price,
    request.body.thumbnail
  ); // !!! Modificar con HTML para agregar productos
  if (id > productList.length || id < 1) {
    response.send("Ha ingresado un número fuera de rango");
  } else if (isNaN(id)) {
    response.send("El carácter ingresado no es un número");
  } else if (productList[id - 1] == null) {
    response.send(
      `El id ${request.params.id} fue borrado, no puede ser editado, elija otro id`
    );
  } else {
    productList[id - 1] = product;
    productList[id - 1].id = parseInt(id);
    console.log(
      `El id ${id} fue sobreescrito con el producto "${product.title}"`
    );
    response.json(productList);
  }
});

router.delete("/productos/:id", (request, response) => {
  let id = request.params.id;
  if (id > productList.length || id < 1) {
    response.send("Ha ingresado un número fuera de rango");
  } else if (isNaN(id)) {
    response.send("El carácter ingresado no es un número");
  } else if (productList[id - 1] == null) {
    response.send(`El id ${request.params.id} ya fue borrado anteriormente`);
  } else {
    genericProduct.deleteById(id);
    response.json(productList);
  }
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
