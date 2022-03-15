const graphql = require('graphql');
var _ = require('lodash');
const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");




//dummy data
// var usersData = [   {id: '1', name: 'bond', age: 34, profession: 'Developer'},
//                     {id: '25', name: 'infinity', age: 21, profession: 'Designer'},
//                     {id: '45', name: 'RDJ', age: 44, profession: 'Singer'},
//                     {id: '478', name: 'strange', age: 42, profession: 'Teacher'},
//                     {id: '63', name: 'Tom', age: 22, profession: 'Painter'},
//                 ];

// hobbiesData = [ {id: '1', title: 'Programming', descrpition: 'Using computers to make a better place', userId: '1'},
//                 {id: '2', title: 'Rowing', descrpition: 'Feel the drift', userId: '25'},
//                 {id: '3', title: 'Swimming', descrpition: 'fly through water', userId: '45'},
//                 {id: '4', title: 'Fencing', descrpition: 'A hobby for fency people', userId: '478'},
//                 {id: '5', title: 'Hiking', descrpition: 'to climb the mountain', userId: '63'},
//             ];


// postsData = [   {id: '1', comment: 'Building a mind', userId: '1'},
//                 {id: '2', comment: 'A GraphQL project', userId: '25'},
//                 {id: '3', comment: 'Flutter with GraqphQL', userId: '478'},
//                 {id: '4', comment: 'Building a mind', userId: '1'},
//                 {id: '4', comment: 'Building a mind', userId: '63'}
// ];



const {

    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList

} = graphql

//create types
const UserType = new GraphQLObjectType({
    name: 'User',
    descrpition: 'Documentation for user..',
    fields: ()=>({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        

        //query to get all hobbies related to user
        hobby: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return _.filter(hobbiesData, {userId: parent.id})
            }
        },
        // query to get all posts to  user
        posts: {
                type: new GraphQLList(PostType),
                resolve(parent, args){
                    return _.filter(postsData, {userId: parent.id})
                }

        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    descrpition: 'Hobby Description',
    fields: ()=>({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        descrpition: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId})//returning the data for the user who have this hobby
            }
        }


    })
});

const PostType = new GraphQLObjectType({
    name : 'Post',
    descrpition: 'Post Description',
    fields: ()=> ({
        id: {type: GraphQLID},
        comment : {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId}) //returning the data for the user who wrote this post
            }
        }
    
    })
});





//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    descrpition: 'Description',
    fields: {
        //Query for fetch user
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args){
                return _.find(usersData, {id: args.id})
            // we resolve with data
            // get and return data from a datasource
            }
        
        },
        //Query for fetch all users
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return usersData;
            }
        },
        
        //Query for fetching hobby
        hobby: {
            type: HobbyType,
            args: {id: {type:GraphQLID}},

            resolve(parent, args){
                return _.find(hobbiesData, {id: args.id})
              //return data for our hobby
            }

        },

        //Query for fetching all hobbies
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return hobbiesData;
            }
        },

        //Query for fetching post
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args){
                //return data for post
                return _.find(postsData, {id: args.id})
            }
        },

        //Query for Fetching all Posts
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return postsData;
            }
        },


    }

});

//Mutations

const Mutation = new GraphQLObjectType({

    name: 'Mutation',
    fields:{
        //Mutation for creating User
        createUser: {
            type: UserType,
            args: {
               // id: {type: GraphQLID}
                name: {type: GraphQLString},
                age: {type: GraphQLInt },
                profession: {type: GraphQLString}
            },

            resolve (parent, args){
                let user = User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });
                return user.save();
            }
        },


        //Mutation for creating post
        createPost: {
            type: PostType,
            args: {
                //id : {type: GraphQLID},
                comment: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let post = Post({
                    comment: args.comment,
                    userId: args.userId,
                });
                return post.save();
                
            }
        },


        //Mutation for creating hobby

        createHobby: {
            type: HobbyType,
            args: {
                //id: {type: GraphQLID},
                title: {type: GraphQLString},
                descrpition: {type: GraphQLString},
                userId: {type: GraphQLID},

            },

            resolve (parent, args){
                let hobby = {
                    title: args.title,
                    descrpition: args.descrpition,
                    userId: args.userId,
                }
                return hobby;
            }
        }

    }

});




module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})