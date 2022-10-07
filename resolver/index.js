const resolver = require('./resolver')

const {GraphQLUpload} = require("graphql-upload");

const uploadResolver = {
    Upload: GraphQLUpload
}

module.exports = [
    uploadResolver,
    resolver
]