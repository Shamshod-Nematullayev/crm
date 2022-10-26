// Session connection
const MongoDBSession = require('connect-mongo')

const store = MongoDBSession.create({
    mongoUrl: process.env.MONGO,
    clientPromise: true,
    client: true
})
