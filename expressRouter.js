const express = require("express");
const { Router } = express;
const app = express();
const router = Router();
const router2 = Router();
const PORT = 8080;
const mascotas = [];
const personas = [];
const rena = { nombre: "Renato", raza: "Boxer", edad: 8 };
const rodri = { nombre: "Rodrigo", apellido: "Monroy", edad: 30 };
mascotas.push(rena);
personas.push(rodri);

// Se crea y configura el servidor para que escuche un determinado puerto
const server = app.listen(PORT, () => {
  console.log(`App Express escuchando en el puerto ${server.address().port}`);
});

// Función para el manejo de errores del servidor
server.on("Error", (error) =>
  console.log(`Ocurrió el siguiente error: ${error}`)
);

// Para interpretar los JSON que se envian al server:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/api", router2);

router.get("/mascotas", (request, response) => {
  response.json(mascotas);
});

router.post("/mascotas", (request, response) => {
  let mascota = {
    nombre: request.query.nombre,
    raza: request.query.raza,
    edad: parseInt(request.query.edad),
  };
  mascotas.push(mascota);
  response.json(mascotas);
});

router2.get("/personas", (request, response) => {
  response.json(personas);
});

router2.post("/personas", (request, response) => {
  let persona = {
    nombre: request.query.nombre,
    apellido: request.query.apellido,
    edad: parseInt(request.query.edad),
  };
  personas.push(persona);
  response.json(personas);
});

// EXPRESS STATIC

app.use(express.static("public")); // Establecer el directorio "public" como estático, se pueden poner más de 1 si es necesario

app.use("/static", express.static(__dirname + "/public")); // Establecer un prefijo virtual

app.get("/", (request, response) => {
  // Establecer index.html como página principal
  response.sendFile(__dirname + "/public/index.html");
});

// MIDDLEWARE
// Funciones Middleware
function miMiddleware1(req, res, next) {
  req.miAporte1 = "Dato aportado por mi Middleware 1";
  next();
}
function miMiddleware2(req, res, next) {
  req.miAporte2 = "Dato aportado por mi Middleware 2";
  next();
}
// Uso del Middleware
router.get("/mensajeConMiddleware", miMiddleware1, (req, res) => {
  let aporte1 = req.miAporte1;
  res.send({ aporte1 });
});
// Uso de 2 Middleware
router.get(
  "/mensajeConMiddlewareDoble",
  miMiddleware1,
  miMiddleware2,
  (req, res) => {
    let aporte1 = req.miAporte1;
    let aporte2 = req.miAporte2;
    res.send({ aporte1, aporte2 });
  }
);
// Función para el manejo de errores con Middleware
app.use(function (error, req, res, next) {
  console.log(error);
  res.status(500).send("Algo se rompió!");
});

// MULTER
// Instalación: npm install express express multer
const multer = require("multer");
// Set storage
var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads"); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage });
// Configurar una ruta para subir un archivo
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file;
  if (!file){
    const error = new Error('Por favor suba un archivo');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
}) 
// Configurar una URL para subir varios archivos
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
  const files = req.files;
  if (!files){
    const error = new Error('Por favor suba un archivo');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(files);
})