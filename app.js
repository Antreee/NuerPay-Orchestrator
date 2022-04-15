if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')
const PORT = process.env.PORT || 4000
// const Redis = require("ioredis");
// const redis = new Redis({
//   port: process.env.REDIS_PORT,
//   host: process.env.REDIS_HOST,
//   password: process.env.REDIS_PASSWORD,
// });

const typeDefs = gql`
  type Restaurant {
    _id: String
    name: String
    logoUrl: String
    cuisine: [String]
    address: String
    contactNumber: String
    location: Location
    available: Boolean
    capacity: Int
    mainImagesUrl: [String]
    adminId: String
  }
  type Location {
    type: String
    coordinates: [Float]
  }
  type Item {
    _id: String
    restaurantId: String
    name: String
    price: Int
    categoryItem: String
    imageUrl: String
    description: String
  }
  type OrderDetail {
    _id: String
    orderId: String
    foodId: String
    quantity: Int
  }
  type Order {
    _id: String
    customerName: String
    customerPhoneNumber: String
    tableNumber: String
    totalPrice: Int
    bookingDate: String
    numberOfPeople: Int
    status: String
  }
  type FavouriteRestaurant {
    id: ID
    customerId: String
    restaurantId: String
  }
  type UserProfile {
    _id: String
    fullName: String
    email: String
    password: String
    phoneNumber: String
    profilePicture: String
    role: String
  }
  type Info {
    message: String
  }
  type InputDetail {
    foodId: Int
  }
  type Query {
    restaurants: [Restaurant]
    restaurant(_id: ID!): Restaurant
    items: [Item]
    itemsByRestaurantId(_id: ID!): [Item]
    orderDetails(orderId: String!): [OrderDetail]
    orders(customerName: String!): [Order]
    favourites(customerId: String!): [FavouriteRestaurant]
    userProfile(_id: String!): UserProfile
  }
  type Mutation {
    createOrder(
      customerName: String
      customerPhoneNumber: String
      tableNumber: String
      totalPrice: Int
      bookingDate: String
      numberOfPeople: Int
    ): Info
  }
`
const resolvers = {
  Query: {
    restaurants: async () => {
      try {
        const { data: restaurants } = await axios({
          url: 'http://localhost:3000/restaurants',
          method: 'GET',
        })
        return restaurants
      } catch (error) {
        console.log(error.response.data)
      }
    },
    restaurant: async (_, args) => {
      try {
        const { data: restaurant } = await axios({
          url: `http://localhost:3000/restaurants/${args._id}`,
          method: 'GET',
        })
        return restaurant
      } catch (error) {
        console.log(error.response.data)
      }
    },
    items: async () => {
      try {
        const { data: items } = await axios({
          url: 'http://localhost:3000/items',
          method: 'GET',
        })
        return items
      } catch (error) {
        console.log(error.response.data)
      }
    },
    itemsByRestaurantId: async (_, args) => {
      try {
        const { data: itemsByRestaurantId } = await axios({
          url: `http://localhost:3000/restaurants/${args._id}/items`,
          method: 'GET',
        })
        return itemsByRestaurantId.item
      } catch (error) {
        console.log(error.response.data)
      }
    },
    orderDetails: async (_, args) => {
      try {
        const { data: orderDetails } = await axios({
          url: 'http://localhost:3000/orderDetails',
          method: 'GET',
          params: {
            orderId: args.orderId,
          },
        })
        return orderDetails
      } catch (error) {
        console.log(error.response.data)
      }
    },
    orders: async (_, args) => {
      try {
        const { data: orders } = await axios({
          url: 'http://localhost:3000/orders',
          method: 'GET',
          params: {
            customerName: args.customerName,
          },
        })
        return orders
      } catch (error) {
        console.log(error.response.data)
      }
    },
    favourites: async (_, args) => {
      try {
        const { data: favourites } = await axios({
          url: 'http://localhost:3000/favouriteRestaurants',
          method: 'GET',
          params: {
            customerId: args.customerId,
          },
        })
        return favourites
      } catch (error) {
        console.log(error.response.data)
      }
    },
    userProfile: async (_, args) => {
      try {
        const { data: userProfile } = await axios({
          url: `http://localhost:3000/userProfiles/${args._id}`,
          method: 'GET',
        })
        return userProfile
      } catch (error) {
        console.log(error.response.data)
      }
    },
  },
  Mutation: {
    createOrder: async (_, args) => {
      try {
        const {
          customerName,
          customerPhoneNumber,
          tableNumber,
          totalPrice,
          bookingDate,
          numberOfPeople,
          orderDetails,
        } = args

        const { data: orders } = await axios({
          url: 'http://localhost:3000/orders',
          method: 'POST',
          data: {
            customerName,
            customerPhoneNumber,
            tableNumber,
            totalPrice,
            bookingDate,
            numberOfPeople,
            status,
          },
        })
        return orders
      } catch (error) {
        console.log(error.response.data)
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
