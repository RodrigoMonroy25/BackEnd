// File System
const fs = require("fs");

// Express
const express = require("express");
const app = express();

// Router
const { Router } = express;
const router = Router();
app.use("/api", router);

// Static
app.use(express.static("public"));
app.use("/static", express.static(__dirname + "/public"));

// HBS
const handlebars = require("express-handlebars");
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// JSON
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
//const urlencodedParser = bodyParser.urlencoded({ extended: false });
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// IO
const { Server: HttpServer } = require('http');
const { Server: IOServer} = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on("connection", (socket) => {
  console.log("Usuario conectado");
  socket.emit("messages", messageList);

  socket.on("notificacion", (data) => {
    console.log(data);
  });

  socket.on("mensaje", (data) => {
    messageList.push(data)
    io.sockets.emit('messages', messageList)
  });
});

// PRODUCTOS
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

// CHAT
const createMessageBox = fs.writeFileSync("./mensajes.json", "[]");
const readMessageBox = fs.readFileSync("./mensajes.json", "utf-8");
const messageList = JSON.parse(readMessageBox);
class Mensajes {
  constructor (user, message) {
    this.user = user;
    this.message = message;
  }
  save(message) {
    messageList.push(message);
    try {
      fs.writeFileSync("./mensajes.json", JSON.stringify(messageList));
      console.log(
        `Chat - ${message.user}: ${message.message}`
      );
    } catch {
      console.log(`Ha ocurrido un error al enviar el mensaje`);
    }
  }
}
let genericMessage = new Mensajes("Rodrigo Monroy", "Hola!!!");
genericMessage.save(genericMessage);

app.get("/", (request, response) => {
  response.render("./layouts/index.hbs", { productList });
});

router.get("/productos", (request, response) => {
  if (productList.length < 1) {
    response.send(`La lista de productos se encuentra vacía`);
  } else {
    genericProduct.getAll();
    response.render("./layouts/productList.hbs", { productList });
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

router.post("/productos", jsonParser, (request, response, next) => {
  let product = new Contenedor(request.title, request.price, request.thumbnail);
  product.save(product);
  response.render('./layouts/index.hbs')
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



// Se crea y configura el servidor para que escuche un determinado puerto
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`App Express escuchando en el puerto ${server.address().port}`);
});
// Función para el manejo de errores del servidor
server.on("Error", (error) =>
  console.log(`Ocurrió el siguiente error: ${error}`)
);
