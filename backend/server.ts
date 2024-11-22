import app from "./src/app";
import { config } from "./src/config/config";
import dbConnection from "./src/config/db";

const startServer = async () => {
  //Connectin to database
  await dbConnection();

  const PORT = config.port || 3000;

  app.listen(PORT, () => {
    console.log(`Listening from PORT: ${PORT}`);
  });
};

startServer();
