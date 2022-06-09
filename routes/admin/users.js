const User = require("../../models/User");
const router = require("express").Router();
const paginate = require("jw-paginate");

//get all users pagination
router.get("/list", async (req, res) => {
  try {
    const users = await User.find();

    // get page from query params or default to first page
    const page = parseInt(req.query.page) || 1;

    // get pager object for specified page
    const pager = paginate(users.length, page);

    // get page of items from items array
    const pageOfItems = users.slice(pager.startIndex, pager.endIndex + 1);

    // return pager object and current page of items
    return res.json({ pager, pageOfItems });
  } catch (err) {
    console.log(err);
    res.status(501).json(err);
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a new user
router.post("/create", async (req, res) => {
  try {
    // create new users
    const newUser = await User(req.body);
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(501).json(error);
  }
});

//update user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//
router.post("/delete", async (req, res) => {
  try {
    await User.deleteMany({ _id: req.body });
    res.status(200).json("Utilisateur(s) supprimé(s)");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
