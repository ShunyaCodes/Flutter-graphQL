const graphql = require('graphql');

const {

    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema

} = graphql

//create types
const UserType = new GraphQLObjectType({
    name: 'User',
    descrpition: 'Documentation for user..',
    fields: ()=>({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    descrpition: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args){
                
            // we resolve with data
            // get and return data from a datasource
            }
        
        }
    }

});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery
})