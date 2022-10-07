const {ApolloServer} = require("apollo-server-express");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('./config')
const typeDefs = fs.readFileSync("./schema.graphql", "utf-8").toString();
const resolvers = require("./resolver/index");
const db = require("./models")
const User = db.users;

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {

		const token = req.headers.authorization || '';
		if(token){
			var payload = jwt.verify(token, config.secret, {
				expiresIn: '3h'
			})
			return User.findByPk(payload.userid)
					.then(data => {
						if(data){
							return {data};
						}else{
							return {};
						}
						
					})
					.catch(err => {
						return {};
					});
		}else{
			return {};
		}
	}
});

module.exports = apolloServer;