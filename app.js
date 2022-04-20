if (process.env.NODE_ENV !== "production") require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const PORT = process.env.PORT || 4000;
// const Redis = require("ioredis");
// const redis = new Redis({
//   port: process.env.REDIS_PORT,
//   host: process.env.REDIS_HOST,
//   password: process.env.REDIS_PASSWORD,
// });

const context = async ({ req }) => {
  const access_token = await req.headers.authorization;
  return { access_token };
};

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
    restaurantDistance: Float
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
    restaurantId: String
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
  type MessageLogin {
    status: String
    access_token: String
  }
  input InputDetail {
    itemId: String
    quantity: Int
  }
  input OrderDetails {
    data: [InputDetail]
  }
  type Query {
    restaurants(stringCoordinates: String, search: String): [Restaurant]
    restaurant(_id: ID!): Restaurant
    items: [Item]
    itemsByRestaurantId(_id: ID!): [Item]
    orderDetails(orderId: String!): [OrderDetail]
    orders(customerName: String!): [Order]
    favourites(customerId: String!): [FavouriteRestaurant]
    userProfile(_id: String!): UserProfile
    getRestaurantByAdmin: [Restaurant]
    getOrdersByRestaurantId(_id: ID!): [Order]
    getBookedByRestaurantId(_id: ID!): [Order]
  }
  type Mutation {
    createOrder(
      customerName: String
      customerEmail: String
      customerPhoneNumber: String
      tableNumber: String
      totalPrice: Int
      bookingDate: String
      numberOfPeople: Int
      restaurantId: String
      orderDetails: OrderDetails
    ): Info
    updateAvailability(available: String): Info
    login(email: String, password: String): MessageLogin
  }
`;
const resolvers = {
  Query: {
    restaurants: async (_, args) => {
      try {
        let { data: restaurants } = await axios({
          url: "http://localhost:3000/restaurants",
          method: "GET",
          headers: {
            coordinates: args.stringCoordinates,
          },
        });
        if (args.search) {
          restaurants = restaurants.filter(
            (el) =>
              el.name.toLowerCase().indexOf(args.search.toLowerCase()) > -1
          );
        }
        return restaurants;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    restaurant: async (_, args) => {
      try {
        const { data: restaurant } = await axios({
          url: `http://localhost:3000/restaurants/${args._id}`,
          method: "GET",
        });
        return restaurant;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    items: async () => {
      try {
        const { data: items } = await axios({
          url: "http://localhost:3000/items",
          method: "GET",
        });
        return items;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    itemsByRestaurantId: async (_, args) => {
      try {
        const { data: itemsByRestaurantId } = await axios({
          url: `http://localhost:3000/restaurants/${args._id}/items`,
          method: "GET",
        });
        return itemsByRestaurantId.item;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    orderDetails: async (_, args) => {
      try {
        const { data: orderDetails } = await axios({
          url: "http://localhost:3000/orderDetails",
          method: "GET",
          params: {
            orderId: args.orderId,
          },
        });
        return orderDetails;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    orders: async (_, args) => {
      try {
        const { data: orders } = await axios({
          url: "http://localhost:3000/orders",
          method: "GET",
          params: {
            customerName: args.customerName,
          },
        });
        return orders;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    favourites: async (_, args) => {
      try {
        const { data: favourites } = await axios({
          url: "http://localhost:3000/favouriteRestaurants",
          method: "GET",
          params: {
            customerId: args.customerId,
          },
        });
        return favourites;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    userProfile: async (_, args) => {
      try {
        const { data: userProfile } = await axios({
          url: `http://localhost:3000/userProfiles/${args._id}`,
          method: "GET",
        });
        return userProfile;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    getRestaurantByAdmin: async (_, args, context) => {
      try {
        const { data: restaurant } = await axios({
          url: `http://localhost:3000/restaurants/admin`,
          method: "GET",
          headers: {
            access_token: context.access_token,
          },
        });

        return restaurant;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    getOrdersByRestaurantId: async (_, args, context) => {
      try {
        const { data: getOrdersByRestaurantId } = await axios({
          url: `http://localhost:3000/restaurants/${args._id}/orders`,
          method: "GET",
          headers: {
            access_token: context.access_token,
          },
        });

        return getOrdersByRestaurantId.orders;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    getBookedByRestaurantId: async (_, args, context) => {
      try {
        const { data: getBookedByRestaurantId } = await axios({
          url: `http://localhost:3000/restaurants/${args._id}/booked`,
          method: "GET",
          headers: {
            access_token: context.access_token,
          },
        });

        return getBookedByRestaurantId.booked;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    createOrder: async (_, args) => {
      console.log(args);
      try {
        const {
          customerName,
          customerPhoneNumber,
          customerEmail,
          tableNumber,
          totalPrice,
          bookingDate,
          numberOfPeople,
          restaurantId,
          orderDetails,
        } = args;
        const { data: response } = await axios({
          url: "http://localhost:3000/customers/orders",
          method: "POST",
          data: {
            customerName,
            customerPhoneNumber,
            customerEmail,
            tableNumber,
            totalPrice,
            bookingDate,
            numberOfPeople,
            restaurantId,
            orderDetails: orderDetails ? orderDetails.data : null,
          },
        });
        return { message: response };
      } catch (error) {
        console.log(error.response.data);
      }
    },

    login: async (_, args) => {
      try {
        const { email, password } = args;
        const { data: response } = await axios({
          url: "http://localhost:3000/admin/login",
          method: "POST",
          data: {
            email,
            password,
          },
        });
        return { status: response.status, access_token: response.access_token };
      } catch (error) {
        throw error;
      }
    },
    updateAvailability: async (_, args, context) => {
      try {
        const { data: response } = await axios({
          url: `http://localhost:3000/restaurants/${args._id}`,
          method: "PATCH",
          data: {
            availability: args.availability,
          },
          headers: {
            access_token: context.access_token,
          },
        });
        return { message: response };
      } catch (err) {
        console.log(err);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});
server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
