const Shop = require("../models/Shop");
const router = require("express").Router();
const auth = require("../middleware/auth");

//create a new shop
router.post("/create", auth, async (req, res) => {
  try {
    // create new shops
    const newShop = new Shop(req.body);
    newShop.author = req.user._id;
    const shop = await newShop.save();
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update shop
router.put("/:id", async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(shop);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete shop
router.delete("/:id", async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json("Shop has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//get a shop
router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all shops
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find({ isVisible: true }).sort({ _id: -1 });
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all shops
router.get("/category/:id", async (req, res) => {
  try {
    const shops = await Shop.find({
      categories: { $in: [req.params.id] },
    });
    res.status(200).json(shops);
  } catch (err) {
    console.log("RERRR");
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
