const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value<0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password phrase contains password keyword')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
});

userSchema.virtual('tasks', { // Virtual properties. Does not store in the db
    ref: 'Task', // Task Model
    localField: '_id', // In Task Model owner property and _id field
    foreignField: 'owner' // In Task Model owner property
})

//Instance Methods
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET, {expiresIn:'1 hours'})
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}
userSchema.methods.toJSON = function() { // Overriding the default function of toJSON. Casing important
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//Schema Methods
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Username and Password is incorrect');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Username and Password is incorrect');
    }
    return user;
}

// Hash the password before saving.
userSchema.pre("save", async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

userSchema.pre("remove", async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User', userSchema);

module.exports = User;