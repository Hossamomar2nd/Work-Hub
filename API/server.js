import app from "./app.js";
import { DBconnection } from "./DB/connection.js";
import { env } from "./src/config/env.js";

app.listen(env.port, () => {
  console.log(`App listening on port ${env.port}!`);
  DBconnection();
});
