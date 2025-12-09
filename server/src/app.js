import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { typeDefs, resolvers } from "./graphql/index.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: PORT },
})
  .then(() => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.log("Server Error:", err.message);
  });
