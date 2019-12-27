const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// The route to the application is GET api/profile/me
// The description: Get current user's profile
// Who can access this route. The current user.

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
  } catch (error) {
    res.status(500).send("Server error I'm sorry");
  }
});

// The route to the application is POST api/profile
// The description: Create or update user profile
// Who can access this route. PRIVATE.

router.post("/", auth, async (req, res) => {
  const {
    location,
    bio,
    goals,
    goalsCompleted,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (goals) profiledFields.goals = goals;
  if (goalsCompleted) profileFields.goalsCompleted = goalsCompleted;

  // Build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facbeook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // Update
    if (profile) {
      await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }

  res.send("You made it to the bottom of profile route");
});

module.exports = router;
