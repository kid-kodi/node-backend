const router = require("express").Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");

const Email = require("../../helpers/email");
const Utility = require("../../helpers/utility");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    user.verificationToken = Utility.randomTokenString();
    await user.save();
    const token = await user.generateAuthToken();
    await Email.sendVerificationEmail(user, req.get("origin"));
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Verify Email
router.post("/verify-email", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.body.token });
    if (!user) {
      res.status(200).send({ error: true, message: "" });
    }
    user.verified = Date.now();
    user.verificationToken = undefined;
    await user.save();
    res.status(200).send({ error: false, message: "" });
  } catch (e) {
    res.status(400).send({ e, message: e.message });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(201).send({ profile: user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// Logout user
router.post("/logout", auth, async (req, res) => {
  try {
    let tokenIndex = req.user.tokens.findIndex((obj) => obj.token == req.token);
    // Here we keep the old token to be used as EasyLogin authenticator
    req.user.tokens[tokenIndex].status = "trashed";
    req.user.tokens[tokenIndex].easy_login_count = 0;

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Login user
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return;

    user.resetToken = {
      token: Utility.randomTokenString(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    await user.save();
    await Email.sendPasswordResetEmail(user, req.get("origin"));
    res.status(200).send({
      message:
        "Veuillez vérifier votre adresse électronique pour les instructions de réinitialisation du mot de passe",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const user = await User.findOne({
      "resetToken.token": req.body.token,
      "resetToken.expires": { $gt: Date.now() },
    });
    if (!user) throw "Jeton invalide";

    // update password and remove reset token
    user.password = req.body.password;
    user.resetToken = undefined;
    await user.save();
    res.status(200).send({
      message:
        "Réinitialisation du mot de passe réussie, vous pouvez maintenant vous connecter",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// Get user's profile
router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

// Update user's profile
router.post("/me/update", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    Object.assign(user, req.body);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update user's profile
router.post("/me/password", auth, async (req, res) => {
  try {
    const user = await req.user.changePassword(req.body);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
