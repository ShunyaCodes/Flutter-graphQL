const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./server/schema/schema");
const mongoose = require("mongoose");
const cors = require('cors');


const app = express();
const port = process.env.PORT || 4000;


app.use(cors());
app.use('/graphql', graphqlHTTP({
        graphiql: true,
        schema: schema,
}));


//connection with MongoDB Database
mongoose.connect
(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.1g4wq.mongodb.net/${process.env.MongoDatabase}?retryWrites=true&w=majority`,
{ useNewUrlParser: true, useUnifiedTopology: true}
)
.then(()=>{
        app.listen({port:port}, ()=> { 
        console.log(process.env.mongoUserName);
        //localhost:4000
        console.log('Listening for rquests on port' + port);
    });
}).catch((e) => {
    console.log("Error:::" + e);
});

