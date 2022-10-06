const {ApolloServer} = require("apollo-server-express");
const fs = require('fs');

const typeDefs = fs.readFileSync("./schema.graphql", "utf-8").toString();
const resolvers = require("./resolver/index");

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

module.exports = apolloServer;