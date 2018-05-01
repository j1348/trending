import mongoose from 'mongoose';

const repoSchema = mongoose.Schema(
    {
        author: {
            type: String,
            required: true,
        },
        name: String,
        description: String,
        href: {
            type: String,
            index: true,
            unique: true,
        },
        language: String,
        ticks: [
            {
                stars: Number,
                forks: Number,
                date: Date,
            },
        ],
    },
    { timestamps: true },
);

const Repo = mongoose.model('Repo', repoSchema);

module.exports = Repo;
