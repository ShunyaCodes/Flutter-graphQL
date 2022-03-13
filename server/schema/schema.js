const graphql = require('graphql');
var _ = require('lodash');




//dummy data
var usersData = [   {id: '1', name: 'bond', age: 34},
                    {id: '25', name: 'infinity', age: 21},
                    {id: '45', name: 'RDJ', age: 44},
                    {id: '478', name: 'strange', age: 42},
                    {id: '63', name: 'Tom', age: 22},
                ];
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
                return _.find(usersData, {id: args.id})
            // we resolve with data
            // get and return data from a datasource
            }
        
        }
    }

});


module.exports = new graphql.GraphQLSchema({
    query: RootQuery
})