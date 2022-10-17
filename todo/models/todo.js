const { Schema, model } = require("mongoose");

const TodoSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    createdBy: Schema.Types.ObjectId,
}, {
    timestamps: true,
});

module.exports = model('todo', TodoSchema);