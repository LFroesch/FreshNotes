import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
    // Add reminders or other things
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;