import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";

// db
import db from "./_db.js";

// resolver
const resolvers = {
    Query: {
        games() {
            return db.games
        },
        reviews() {
            return db.reviews
        },
        authors() {
            return db.authors
        },
        review(_, args){
            // query sql/nosql
            return db.reviews.find((review) => review.id === args.id)
        },
        game(_, args){
            // query sql/nosql
            return db.games.find((game) => game.id === args.id)
        },
        author(_, args){
            // query sql/nosql
            return db.authors.find((author) => author.id === args.id)
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Review: {
        author(parent){
            return db.authors.find((a) => a.id === parent.author_id)
        },
        game(parent){
            return db.games.find(g => g.id === parent.game_id)
        }
    },

    Mutation: {
        deleteGame(parent, args){
            db.games = db.games.filter((g => g.id !== args.id))
            return db.games
        },
        addGame(_, args) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString() // generate id
            }
            db.games.push(game)
            return game
        },
        updateGame(_, args){
            db.games = db.games.map(g => {
                if(g.id === args.id){
                    return {...g, ...args.edits}
                }

                return g
            })

            return db.games.find(g => g.id === args.id)
        }
    }
}

/*
example query

games {
    title
}
*/


// server setup
const server =  new ApolloServer({
    // typeDefs -- definitions of type of data exposed on the graph
    typeDefs,
    // resolvers function
    resolvers
})



const { url } =  await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log("Server readi at port", 4000)