const { ApolloServer, gql } = require('apollo-server');

const db = require("./models")
db.sequelize.sync()
    .then(() => {
        console.log("sync db");
    })
    .catch((err) => {
        console.log("error: " + err.message);
    });

const Berita = db.beritas;
const Komentar = db.komentars;
const Op = db.Sequelize.Op;

const resolvers = {
    Query: {
        beritas: () => {
            return Berita.findAll() //async
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        },
        komentars: () => {
            return Komentar.findAll()
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });
        }
    },
    Mutation: {
        getBerita: (parent, { id }) => {
            // Get Berita By Id
            return Berita.findByPk(id) //async
                .then(berita => {
                    return berita;
                })
                .catch(err => {
                    return {};
                });
        },
        deleteBerita: (parent, { id }) => {
            // Soft Delete
            try {
                var berita = {
                    isDelete: true,
                }

                return Berita.update(berita, {
                    where: { id: id }
                })
                    .then(() => {
                        return Berita.findByPk(id)
                    });
            } catch (error) {
                return {}
            }
        }, createKomentar: (parent, { id, text }) => {
            // Params id disini adalah id berita yang memiliki komentar tersebut
            try {
                var komentar = {
                    text: text,
                    beritumId: id
                }
        
                return Komentar.create(komentar)
                    .then(() => {
                        return komentar;
                    });
        
            } catch (error) {
                return {};
            }
        }, replyKomentar: (parent, { id, text }) => {
            // Params id disini adalah idParent komentar tersebut
            try {
                var komentar = {
                    text: text,
                    komentarId: id // foreign key ke parent
                }

                return Komentar.create(komentar)
                    .then(() => {
                        return komentar
                    });

            } catch (error) {
                return {};
            }
        },
    },

};

const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const fs = require('fs');
const path = require('path');
const komentar = require('./models/komentar');
const typeDefs = fs.readFileSync("./schema.graphql", "utf-8").toString();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    /**
     * What's up with this embed: true option?
     * These are our recommended settings for using AS;
     * they aren't the defaults in AS3 for backwards-compatibility reasons but
     * will be the defaults in AS4. For production environments, use
     * ApolloServerPluginLandingPageProductionDefault instead.
    **/
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});  