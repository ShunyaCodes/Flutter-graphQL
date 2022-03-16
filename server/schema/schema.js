const graphql = require('graphql');
var _ = require('lodash');
const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");
const { type } = require('express/lib/response');




//dummy data
// var usersData = [   {id: '1', name: 'bond', age: 34, profession: 'Developer'},
//                     {id: '25', name: 'infinity', age: 21, profession: 'Designer'},
//                     {id: '45', name: 'RDJ', age: 44, profession: 'Singer'},
//                     {id: '478', name: 'strange', age: 42, profession: 'Teacher'},
//                     {id: '63', name: 'Tom', age: 22, profession: 'Painter'},
//                 ];

// hobbiesData = [ {id: '1', title: 'Programming', description: 'Using computers to make a better place', userId: '1'},
//                 {id: '2', title: 'Rowing', description: 'Feel the drift', userId: '25'},
//                 {id: '3', title: 'Swimming', description: 'fly through water', userId: '45'},
//                 {id: '4', title: 'Fencing', description: 'A hobby for fency people', userId: '478'},
//                 {id: '5', title: 'Hiking', description: 'to climb the mountain', userId: '63'},
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
    GraphQLList,
    GraphQLNonNull,

} = graphql

//create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user..',
    fields: ()=>({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        

        //query to get all hobbies related to user
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find({userId: parent.id}) // for mongoDB
               // return _.filter(hobbiesData, {userId: parent.id}) //for dummy data
            }
        },
        // query to get all posts to  user
        posts: {
                type: new GraphQLList(PostType),
                resolve(parent, args){
                    return Post.find({userId: parent.id}) // for MongoDB
                   // return _.filter(postsData, {userId: parent.id}) // for dummy data
                }

        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby Description',
    fields: ()=>({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
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
    description: 'Post Description',
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
    description: 'Description',
    fields: {
        //Query for fetch user
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},

            resolve(parent, args){
                return User.findById(args.id);
                //return _.find(usersData, {id: args.id}) // for dummy data

            }
        
        },
        //Query for fetch all users
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
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
        CreateUser: {
            type: UserType,
            args: {
               // id: {type: GraphQLID}
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt) },
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

        
        //Update User
        UpdateUser: {
            type: UserType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt) },
                profession: {type: GraphQLString},
            },
            resolve(parent, args){
                return updateUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession,
                        }
                    },
                    {new: true} //send back the updated object type
                )
            }
        },

        //remove user
        RemoveUser: { 
        type: UserType,
        args: {
            id: {type: GraphQLNonNull(GraphQLString)},
        },
        resolve(parent,args){
            let removedUser = User.findByIdAndRemove(args.id).exec();
            if(!removedUser){
                throw new "Error:::" ();
            }
            return removedUser;
        }
        },


        //Mutation for creating post
        CreatePost: {
            type: PostType,
            args: {
                //id : {type: GraphQLID},
                comment: {type: GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let post = Post({
                    comment: args.comment,
                    userId: args.userId,
                });
                return post.save();
                
            }
        },

        //Update Post method
        UpdatePost:{
            type: PostType,
            args:
            {   
                id: {type: GraphQLNonNull(GraphQLString)},
                comment: {type: GraphQLNonNull(GraphQLString)},
                
            },
            resolve(parent, args){
                return UpdatePost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment,
                        
                        }
                    },
                    {new: true} //send back the updated object type
                )
            }
        },

        //Remove Post
        RemovePost: {
            type: PostType,
            args: {
            id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
            let removedPost = Post.findByIdAndRemove(args.id).exec();

            if (!removedPost) {
                throw new "Error"();
            }
            return removedPost;
            },
        },

        //Remove Posts
        RemovePosts: {
            type: PostType,
            args: {
            ids: { type: GraphQLList(GraphQLString) },
            },
            resolve(parent, args) {
            let removedPosts = Post.deleteMany({
                _id: args.ids,
            });
            if (!removedPosts) {
                throw new "Error"();
            }
            return removedPosts;
            },
        },


        //Mutation for creating hobby

        CreateHobby: {
            type: HobbyType,
            args: {
                //id: {type: GraphQLID},
                title: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLNonNull(GraphQLID)},

            },

            resolve (parent, args){
                let hobby = Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId,
                });
                return hobby.save();
            }
        },

        //update hobby
        
        UpdateHobby: {
            type: HobbyType,
            args: {
                id: {type: GraphQLNonNull(GraphQLString)},
                title: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                return updateHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            title: args.title,
                            description: args.description,
                        }
                    },
                    {new: true} //send back the updated object type
                )
            }
        },

         //Remove Hobby
        RemoveHobby: {
            type: HobbyType,
            args: {
            id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
            let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
            if (!removedHobby) {
                throw new "Error"();
            }
            return removedHobby;
            },
        },

        //RemoveHobbies
        RemoveHobbies: {
            type: HobbyType,
            args: {
            ids: { type: GraphQLList(GraphQLString) },
            },
            resolve(parent, args) {
            let removedHobbies = Hobby.deleteMany({
                _id: args.ids,
            }).exec();
            if (!removedHobbies) {
                throw new "Error"();
            }
            return removedHobbies;
            },
        },
        


    }//End of the fields

});




module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})