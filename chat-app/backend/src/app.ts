import express, { Express } from "express";
import userRoutes from "./routes/user";
import chatRoutes from "./routes/chat";
import messageRoutes from "./routes/message";
import { errorHandler, notFound } from "./middleware/error";


const app: Express = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

export const createServer = () => {
  const scheme = "http";
  const domain = "localhost";
  const port = process.env.PORT || 7000;

  const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at ${scheme}://${domain}:${port}`);
  });

  return server;
}

export default app;