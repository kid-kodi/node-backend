const Item = require("../../models/Item");
const Category = require("../../models/Category");
const router = require("express").Router();
const auth = require("../../middleware/auth");
const paginate = require("jw-paginate");

//get all items pagination
router.get("/list", async (req, res) => {
  try {
    let search = {};
    if (req.query.category && req.query.category !== "all") {
      search.category = req.query.category;
    }
    if (req.query.title && req.query.title !== "all") {
      search.title = { $regex: req.query.title, $options: "i" };
    }
    const items = await Item.find(search).sort({ created: -1 });

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pager = paginate(items.length, page);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get all items pagination
router.get("/query", async (req, res) => {
  try {
    const items = await Item.find({
      $or: [{ title: { $regex: req.query.title, $options: "i" } }],
    }).sort({ created: -1 });

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pager = paginate(items.length, page);

    // get page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems });
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a new item
router.post("/create", auth, async (req, res) => {
  try {
    // create new items
    console.log(req.body);
    const newItem = new Item(req.body);
    newItem.author = req.user._id;
    const item = await newItem.save();
    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//update item
router.put("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(item);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/delete", async (req, res) => {
  try {
    console.log(req.body);
    await Item.deleteMany({ _id: req.body });
    res.status(200).json("Articles(s) supprimé(s)");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a item
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    console.log(item);
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all items
// get slideshow items
// get recents items
// get popular items
router.get("/category/:name", async (req, res) => {
  try {
    const items = await Item.find({ category: req.params.name });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
