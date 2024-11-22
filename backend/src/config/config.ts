import { config as conf } from "dotenv";
conf()

const _config = {
  port: process.env.PORT,
  databaseUrl:process.env.MONGO_CONNECTION_STRING,
  env:process.env.NODE_ENV,
  secret:process.env.JWT_SECRET,
  expire:process.env.JWT_EXPIRE

};

export const config = Object.freeze(_config);
