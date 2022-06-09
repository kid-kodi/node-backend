const Category = require("../../models/Category");
const router = require("express").Router();

const paginate = require("jw-paginate");

//get all categories pagination
router.get("/list", async (req, res) => {
  try {
    const categories = await Category.find();

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pager = paginate(categories.length, page);

    // get page of items from items array
    const pageOfItems = categories.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems });
  } catch (err) {
    console.log(err);
    res.status(501).json(err);
  }
});

//create a new category
router.post("/create", async (req, res) => {
  try {
    // create new categorys
    const newCategory = await Category(req.body);
    const category = await newCategory.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update category
router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json("Category has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//
router.post("/delete", async (req, res) => {
  try {
    await Category.deleteMany({ _id: req.body });
    res.status(200).json("Categories(s) supprimée(s)");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all categories
router.get("/", async (req, res) => {
  try {
    const categorys = await Category.find();
    res.status(200).json(categorys);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
