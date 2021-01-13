const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../../models/User')

// @route   POST api/user
// @desc    Register User
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Please provide a valid email address').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {

    // If express-validator checks do not match, return errors. 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try { 
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ errors: [ { msg: 'User account with provided email already exists'} ]})
        }

        // Create User model object to submit to mongoDB
        user = new User({
            name,
            email,
            password
        })

        // Encrypt user password in user Object
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        
        // save user object to database
        await user.save() 

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000 }, 
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            } 
        )

    } catch(err) {
        console.error(err.message)
        res.status(500).send('POST api/users failed. Server Error')
    }

});

module.exports = router;