const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true,"Post title is required"],
        trim: true,
    },
    //created only by admin
    category: {
        type: String,
        required: [true,"Post category is required"],
        default: "All",
    },
    isLiked:{
        type: Boolean,
        default: false,
    },
    isDisLiked:{
        type: Boolean,
        default: false,
    },
    numViews:{
        type: Number,
        default: 0,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    disLikes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please Author is required"],
    },
    description: {
        type: String,
        required: [true, "Please description is required"],
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/01/23/17/38/seagull-7739257_960_720.jpg",
    },
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
  }
);

//compile
const Post = mongoose.model("Post", postSchema);

module.exports = Post;