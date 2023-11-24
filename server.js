console.log("Welcome to the User Registration App");
import express from "express";
import router from "./routes/routes.js";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { uri } from "./models/model.js";
import {} from "dotenv/config.js";

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Listening at port 2000");
});

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = new MongoStore({
  mongoUrl: uri,
  dbName: "DeltaAirways",
  collectionName: "DeltaSessions",
});

app.use(
  session({
    secret: "A Secret Key To Sign The Cookies",
    resave: false,
    saveUninitialized: false,
    sessionStore,
  })
);

app.use("/", router);

/*CODE FOR TESTING SESSION VARIABLES */
// app.get("/test", (req, res) => {
//   req.session.usr_name = "Mark";

//   delete req.session.usr_name;
//   console.log(req.session);

//   res.send("this is the test page");
// });
