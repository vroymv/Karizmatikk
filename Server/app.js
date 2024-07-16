//Importing libraries
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var passport = require("passport");
const app = express();
const jwt = require("jsonwebtoken");
const {
  main,
  Wish,
  User,
  OurWork,
  Order,
  Messages,
  PushToken,
} = require("./Database.js");
const { Expo } = require("expo-server-sdk");
const cron = require("node-cron");

//Configuring Express
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(express.json());

//Initializing Database
main();

//Setting dynamic port
const port = process.env.PORT || 3000;

//Creating a new expo client
let expo = new Expo();

//Setting up passport for user authentication
passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.use(passport.initialize());

//Home route for test
app.get("/", function (req, res) {
  res.send("Hello World");
});

//Route for Push Notification Token
app.post("/pushtoken", async function (req, res) {
  try {
    const newToken = new PushToken({
      userId: req.body.id,
      token: req.body.pushToken,
    });

    const existingTokens = await PushToken.findOne({
      token: req.body.pushToken,
    });
    if (!existingTokens) {
      await newToken.save();
      console.log("Push token saved...");
      res.json({
        status: true,
      });
    } else {
      res.json({
        status: "Token already exists in db",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
    });
  }
});

//Route to send push notifications (Wishes);
app.post("/wishall", async function (req, res) {
  //Hit this route while carrying title and msgBody in request
  try {
    let messages = [];
    const allTokens = await PushToken.find();

    for (let pushToken of allTokens) {
      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(
          `Push token ${pushToken.token} is not a valid Expo push token`
        );
        continue;
      }
      let name = await User.find({ _id: pushToken.userId }, { username: 1 });
      name = name[0].username;

      messages.push({
        to: pushToken.token,
        sound: "default",
        title: `Hi, ${name}, ${req.body.title}`,
        body: `${req.body.msgBody}`,
        data: { withSome: "data" },
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

//Request for Authentication
//Authenticatiion middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/auth", authenticateToken, async function (req, res) {
  try {
    const user = await User.find(
      { _id: req.user.id },
      { username: 1, roomNumber: 1, phoneNumber: 1, profileImage: 1 }
    );
    if (user) {
      res.json(user[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

//Login route
app.post("/login", async function (req, res) {
  try {
    const authenticate = User.authenticate();
    authenticate(req.body.tel, req.body.password, async function (err, result) {
      if (err) {
        console.log("Sorry, error occured!");

        console.log(err);
      } else {
        if (result) {
          const userIdObject = await User.find(
            { phoneNumber: req.body.tel },
            "_id"
          );
          const userId = userIdObject[0]._id.valueOf();
          const user = {
            id: userId,
            username: req.body.name,
          };

          const accessToken = jwt.sign(user, process.env.TOKEN_SECRET);
          res.json({
            accessToken: accessToken,
          });
        } else {
          console.log("Sorry user not found!");
          res.json({
            status: false,
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//Route For Placing Order
app.post("/placeorder", async function (req, res) {
  try {
    const newOrder = new Order({
      userId: req.body._id,
      numberOfShoes: req.body.order,
      status: "pendingPickup",
      orderTime: new Date(),
    });

    await newOrder.save();

    const orders = await Order.find({
      $and: [{ userId: req.body._id }, { status: "pendingPickup" }],
    });

    //update user's lastoOrder field in db with newest order
    const filter = { _id: req.body._id };
    const update = { lastOrder: new Date() };
    await User.findOneAndUpdate(filter, update);

    res.json({
      status: true,
      numPendingOrders: orders.length,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
    });
  }
});

//Route for returning Pickup Orders
app.post("/pendingpickup", async function (req, res) {
  try {
    const orders = await Order.find({
      $and: [{ userId: req.body.id }, { status: "pendingPickup" }],
    });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});

app.post("/numberpendingpickup", async function (req, res) {
  try {
    const orders = await Order.find({
      $and: [{ userId: req.body.id }, { status: "pendingPickup" }],
    });
    res.json({
      numPendingOrders: orders.length,
    });
  } catch (error) {
    console.log(error);
  }
});

//Route for updating User Password
app.post("/updatepwd", async function (req, res) {
  try {
    const data = await User.find({ phoneNumber: req.body.tel });
    if (data) {
      const user = await User.findById(data[0]._id).then(function (user) {
        user.setPassword(req.body.password, function () {
          user.save();
        });
      });
      res.json({
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
    });
  }
});

//Route for returning pending delivery Orders
app.post("/pendingdelivery", async function (req, res) {
  try {
    const orders = await Order.find({
      $and: [{ userId: req.body.id }, { status: "pendingDelivery" }],
    });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});

//Find user
app.post("/finduser", async function (req, res) {
  try {
    const searchCriteria = {};
    searchCriteria[req.body.method] = req.body.searchParam;

    const user = await User.find(searchCriteria);
    res.json(user[0]);
  } catch (error) {
    console.log(error);
  }
});

//Route for creating users
app.post("/register", async function (req, res) {
  try {
    User.register(
      {
        roomNumber: req.body.roomNumber,
        phoneNumber: req.body.tel,
        username: req.body.name,
      },
      req.body.pwd,
      async function (err, user) {
        if (err) {
          console.log(err);
        } else {
          console.log("new user created");
          const userIdObject = await User.find(
            { phoneNumber: req.body.tel },
            "_id"
          );
          const userId = userIdObject[0]._id.valueOf();
          const user = {
            id: userId,
            username: req.body.name,
          };

          const accessToken = jwt.sign(user, process.env.TOKEN_SECRET);
          res.json({
            accessToken: accessToken,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//Route to update user Data
app.post("/updateuserdata", async function (req, res) {
  try {
    const filter = { _id: req.body.id };
    const update = {
      profileImage: {
        imgType: null,
        imgUrl: req.body.profileImage,
      },
      username: req.body.name,
      roomNumber: req.body.roomNumber,
      phoneNumber: req.body.tel,
    };
    await User.findOneAndUpdate(filter, update);
    res.json({
      status: true,
    });
  } catch (err) {
    console.log(err);
  }
});

//Route for serving our work
app
  .route("/ourwork")
  .get(async (req, res) => {
    try {
      const count = await OurWork.countDocuments();
      const ourWork = await OurWork.aggregate([{ $sample: { size: count } }]);
      res.json(ourWork);
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res) => {
    try {
      const ourWork = await OurWork.find({ _id: req.body.id });
      res.json(ourWork);
    } catch (error) {
      console.log(error);
    }
  });

//Router for serving Wishes
app.get("/wishes", async function (req, res) {
  try {
    const wishes = await Wish.find();
    res.json(wishes);
  } catch (error) {
    console.log(error);
  }
});

//Route for creating wishes to be hit from admin dashboard
app.post("/createwishes", async function (req, res) {
  try {
    const newWish = new Wish({
      messageImage: {
        imgUrl: req.body.img1Url,
      },

      message: req.body.formText.caption,
    });

    await newWish.save();

    res.json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
    });
  }
});

//Route for deleting wishes to be hit by admin dashboard
app.post("/deletewish", async function (req, res) {
  try {
    await Wish.findByIdAndDelete(req.body.id);
    res.json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
    });
  }
});

//Route for Creating Orders
app.post("/createorder", async function (req, res) {
  try {
    const userInfo = User.find({ _id: req.body.userId });
    const newOrder = new Order({
      userId: req.body.userId,
      numberOfShoes: req.body.numberOfShoes,
      status: "pendingPickup",
      orderTime: new Date(),
    });

    await newOrder.save();
    res.json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
    });
  }
});

//Route for Pulling messeges
app
  .route("/messages")
  .get(async function (req, res) {
    try {
      //To be hit from admin Dashboard
      const messages = await Messages.find();
      res.json({
        messages: messages,
      });
    } catch (error) {
      console.log(error);
    }
  })
  .post(async function (req, res) {
    try {
      const messages = await Messages.find({ userId: req.body.id });
      const unread = await Messages.find({
        $and: [{ userId: req.body.id }, { viewed: false }, { admin: true }],
      });
      res.json({
        messages: messages,
        unread: unread.length,
      });
    } catch (error) {
      console.log(error);
    }
  });

//Post a message
app.post("/postmessage", async function (req, res) {
  try {
    const newMessage = new Messages({
      userId: req.body.userId,
      content: req.body.content,
      sendTime: new Date(),
      phoneNumber: req.body.phoneNumber,
      name: req.body.name,
      admin: req.body.admin,
      viewed: false,
    });
    const done = await newMessage.save();

    if (req.body.admin) {
      const allTokens = await PushToken.find({ userId: req.body.userId });
      let pushToken = allTokens[0];
      console.log(pushToken);
      let messages = [];

      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(
          `Push token ${pushToken.token} is not a valid Expo push token`
        );
      }
      let name = await User.find({ _id: pushToken.userId }, { username: 1 });
      name = name[0].username;

      messages.push({
        to: pushToken.token,
        sound: "default",
        title: `${name}, a new message for you`,
        body: `${req.body.content}`,
        data: {
          withSome:
            "Here is some extra data. Trying to figure out where this goes or what it does",
        },
      });

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    }

    if (done) {
      res.json({
        status: true,
      });
    } else {
      res.json({
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//Route for pulling pending orders both Pending Pickup and Pending Delivery
//To be hit from admin dashboard
app.get("/pendingorders", async function (req, res) {
  try {
    const orders = await Order.find({
      $or: [{ status: "pendingPickup" }, { status: "pendingDelivery" }],
    });
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
});

//Route to update message viewed status to true
app.post("/markread", async function (req, res) {
  try {
    const { id } = req.body;
    const messageUpdates = await Messages.updateMany(
      { userId: id },
      { $set: { viewed: true } }
    );
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res.json({ status: false });
  }
});

//Functions to be used in cron schedule
async function getUsersToRemind() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const usersToRemind = await User.find(
    { lastOrder: { $lt: oneWeekAgo } },
    { _id: 1 }
  );
  const usersToRemindArray = usersToRemind.map((element) =>
    element._id.valueOf()
  );
  const allTokens = await PushToken.find({}, { userId: 1 });
  //Extract the userId property from each of the allTokens objects and push into a new array
  const allTokensArray = allTokens.map((element) => element.userId);

  const usersToRemindWithPushTokens = usersToRemindArray.filter((element) =>
    allTokensArray.includes(element)
  );
  return usersToRemindWithPushTokens;
}

async function sendReminder() {
  try {
    let messages = [];
    const allTokens = await PushToken.find();
    const usersToRemind = await getUsersToRemind();

    const toRemind = allTokens.filter((element) =>
      usersToRemind.includes(element.userId)
    );

    console.log(toRemind);

    for (let pushToken of toRemind) {
      if (!Expo.isExpoPushToken(pushToken.token)) {
        console.error(
          `Push token ${pushToken.token} is not a valid Expo push token`
        );
        continue;
      }
      let name = await User.find({ _id: pushToken.userId }, { username: 1 });
      name = name[0].username;

      messages.push({
        to: pushToken.token,
        sound: "default",
        title: `Hi, ${name}!`,
        body: "We hope you're enjoying clean and fresh shoes! It's been a week since your last order, and we wanted to remind you that it's time to give your shoes another wash.",
        data: { withSome: "data" },
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
}

//Cron job to handle weekly order reminders
// cron.schedule("*/2 * * * *", () => {
//   console.log("Running a scheduled task every 5 minutes");
//   sendReminder();
// });

cron.schedule("0 0 * * *", () => {
  console.log("Running a scheduled task every day at midnight");
  sendReminder();
});

//Listening for port
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
