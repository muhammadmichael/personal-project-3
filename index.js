const {graphqlUploadExpress} = require("graphql-upload");
const app = require("./app");
const apolloServer = require("./apollo");
const db = require("./models")

async function startServer() {
    app.use(graphqlUploadExpress());
    await apolloServer.start();
    apolloServer.applyMiddleware({app});
    app.use('/', (req, res) => {
        res.send("Welcome to Graphql Upload!")
    })
};

startServer();

db.sequelize.sync()
    .then(() => {
        console.log("sync db");
    })
    .catch((err) => {
        console.log("error: " + err.message);
    });

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    console.log(`Graphql EndPoint Path: ${apolloServer.graphqlPath}`);
})