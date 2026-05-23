const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, ".env.test"),
    override: true  
});

console.log("✅ Variables de entorno cargadas para tests");
