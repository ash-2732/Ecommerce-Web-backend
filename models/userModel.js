import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: {},   // this will accept any type of data
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    }
},{
    timestamps: true    // this will automatically add createdAt and updatedAt fields
});

const userModel = mongoose.model('users', userSchema);
export { userModel }