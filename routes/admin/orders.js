const Order = require("../../models/Order");
const router = require("express").Router();
const auth = require("../../middleware/auth");

//create a new Order
router.post("/create", auth, async (req, res) => {
  try {
    // create new Orders
    const newOrder = new Order(req.body);
    newOrder.author = req.user._id;
    const Order = await newOrder.save();
    res.status(200).json(Order);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update Order
router.put("/:id", async (req, res) => {
  try {
    const Order = await Order.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(Order);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete Order
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//get a Order
router.get("/:id", async (req, res) => {
  try {
    const Order = await Order.findById(req.params.id);
    res.status(200).json(Order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all Orders
router.get("/", async (req, res) => {
  try {
    const Orders = await Order.find().sort({ _id: -1 });
    res.status(200).json(Orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all Orders
router.get("/category/:id", async (req, res) => {
  try {
    const Orders = await Order.find({
      categories: { $in: [req.params.id] },
    });
    res.status(200).json(Orders);
  } catch (err) {
    console.log("RERRR");
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
