// ** Express
import express from "express";

// ** Config
import { config } from "./config/config";
import { connection } from "./config/database";

// ** Router
import { mainRouter } from "./routes";
import { swaggerConfig } from "./config/swagger";

const app = express();

config(app);
mainRouter(app);
swaggerConfig(app);

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

(async () => {
  try {
    await connection();

    app.listen(PORT, HOST, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err.message);
  }
})();
