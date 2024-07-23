const cors = require("cors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { AllRoutes } = require("./router/router");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const createError = require("http-errors");
module.exports = class Application {
  #app = express();
  #PORT;
  #DB_URI;
  constructor(PORT, DB_URI) {
    this.#PORT = PORT;
    this.#DB_URI = DB_URI;
    this.configApplication();
    this.connectToMongoDB();
    this.createServer();
    this.createRoute();
    this.errorHandling();
  }
  configApplication() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
    require("./startup/loginng")();
    this.#app.use(
      "/api-doc",
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJsDoc({
          swaggerDefinition: {
            info: {
              title: "your lawyer",
              version: "2.0.0",
              description: "وکیل تو",
            },
          },
          servers: [
            {
              url: "http://localhost:5000",
            },
          ],
          apis: ["./src/router/**/*.js"],
        })
      )
    );
  }
  createServer() {
    const http = require("http");
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log(`run > http://localhost:${this.#PORT}`);
    });
  }
  connectToMongoDB() {
    mongoose
      .connect(
        "mongodb+srv://mohammadpourl:SE8LlSZ55zEy7dzH@cluster0.7tutmup.mongodb.net/patient"
      )

      .then(() => console.log("connected to mongodb"))
      .catch(() => console.log("could not connect"));
    process.on("SIGINT", async () => {
      console.log("disconnected");
      await mongoose.connection.close();
      process.exit(0);
    });
  }
  createRoute() {
    this.#app.use(AllRoutes);
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("the URL not found"));
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;
      return res.status(statusCode).json({
        data: {},
        errors: {
          statusCode,
          message,
        },
      });
    });
  }
};
