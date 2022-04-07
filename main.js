const fs = require("fs");

const createFile = fs.writeFileSync("./productos.json", "[]");
const readFile = fs.readFileSync("./productos.json", "utf-8");
const productList = JSON.parse(readFile);
console.log(productList);
let id = 1;

const { response } = require("express");
const express = require("express");
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`App Express escuchando en el puerto ${server.address().port}`);
});

server.on(
  "Error",
  (
    error // Para controlar errores
  ) => console.log(`Ocurrió el siguiente error: ${error}`)
);

app.get("/", (request, response) => {
  response.send('<h1 style="color:0000FF"> Bienvenidos al servidor Express </h1>');
});

app.get("/products", (request, response) => {
  response.send(productList.map(product => product.title));
});

app.get("/productRandom", (request, response) => {
  let randomNumber = Math.floor(Math.random()*productList.length);
  let randomItem = productList[randomNumber];
  response.send(randomItem);
});


class Contenedor {
  constructor(title, price, thumbnail) {
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
    this.id = "";
  }

  save(product) {
    product.id = id++;
    productList.push(product);
    try {
      fs.writeFileSync("./productos.json", JSON.stringify(productList));
      console.log(
        `Producto ${product.title} agregado con éxito, id: ${product.id}`
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

const exampleProduct = new Contenedor("Microondas", 100, "ImagenMicroondas.jpg");
const exampleProduct2 = new Contenedor("Heladera", 200, "ImagenHeladera.jpg");
const exampleProduct3 = new Contenedor("Notebook", 300, "ImagenNotebook.jpg");

exampleProduct.save(exampleProduct);
exampleProduct.save(exampleProduct2);
exampleProduct.save(exampleProduct3);
