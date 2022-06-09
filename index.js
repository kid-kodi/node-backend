const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

//Load public routes
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const categoriesRoutes = require("./routes/categories");
const shopsRoutes = require("./routes/shops");
const itemsRoutes = require("./routes/items");
const ordersRoutes = require("./routes/orders");
const uploadRoutes = require("./routes/upload");

// Laod admin routes
const authAdminRoutes = require("./routes/admin/auth");
const usersAdminRoutes = require("./routes/admin/users");
const itemsAdminRoutes = require("./routes/admin/items");
const ordersAdminRoutes = require("./routes/admin/orders");
const categoriesAdminRoutes = require("./routes/admin/categories");

// Load Custom Middleware
const errorHandler = require("./middleware/error");

//app configuration
dotenv.config();

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

const corsOptions = {
  credentials: true,
  origin: "*",
};
app.use(cors(corsOptions));
app.use("/", express.static(path.join(__dirname, "uploads")));

//use middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Public api
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/shops", shopsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/upload", uploadRoutes);

// Admin api
app.use("/api/admin/auth", authAdminRoutes);
app.use("/api/admin/users", usersAdminRoutes);
app.use("/api/admin/items", itemsAdminRoutes);
app.use("/api/admin/orders", ordersAdminRoutes);
app.use("/api/admin/categories", categoriesAdminRoutes);

// add custom error handler middleware as the last middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Express server started ${process.env.PORT}`);
});
