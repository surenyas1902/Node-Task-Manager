const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim:true
    },
    IsCompleted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

taskSchema.pre('save', async function(next) {
    console.log("Before Saving Task")
    next() // Until the next call happens it wont save the data or move to the next step.
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task