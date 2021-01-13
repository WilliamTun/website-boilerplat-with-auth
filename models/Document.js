const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    documentName: {
        type: String,
        required: true
    },
    documentFields: [
        {
            fieldName: {
                type: String,
                required: true
            },
            fieldValue: {
                type: String
            }
        }
    ]
})