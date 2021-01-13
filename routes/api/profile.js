const express = require('express');
const router = express.Router(); 
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/profile/me
// @desc    Create or update user profile
// @access  Private
router.post('/' ,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
        const {
            mobile,
            address,
            postcode
        } = req.body 

        // Build profile Object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (mobile) profileFields.mobile = mobile
        if (address) profileFields.address = address
        if (postcode) profileFields.postcode = postcode

        try {   
            let profile = Profile.findOne({ user: req.user.id });

            if(profile) {
                // Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true } 
                );

                return res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);
            await Profile.save();
            res.json(profile);

        } catch ( err ) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }

    }
)

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
        try {
        // @todo - remove users posts

        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User removed'});

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Serve Error')
        }
    }

)



module.exports = router;