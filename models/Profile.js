const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    mobile: {
        type: String
    },
    address: {
        type: String
    },
    postcode: {
        type: String
    }

})