import app from "./src/app";

const startServer = () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Listening from PORT: ${PORT}`);
  });
};

startServer();
