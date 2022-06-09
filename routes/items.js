const Item = require("../models/Item");
const router = require("express").Router();
const auth = require("../middleware/auth");

//create a new item
router.post("/create", auth, async (req, res) => {
  try {
    // create new items
    const newItem = new Item(req.body);
    newItem.author = req.user._id;
    const item = await newItem.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update item
router.put("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(item);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json("Item has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//get a item
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({ isVisible: true }).sort({ _id: -1 });
    res.status(201).json(items);
  } catch (err) {
    res.status(501).json(err);
  }
});

//get all items
router.get("/category/:id", async (req, res) => {
  try {
    const items = await Item.find({
      categories: { $in: [req.params.id] },
    });
    res.status(200).json(items);
  } catch (err) {
    console.log("RERRR");
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
