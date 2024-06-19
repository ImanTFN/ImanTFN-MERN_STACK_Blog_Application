const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const fs = require("fs");
const validateMongodbId = require("../../utils/validateMongodbID");
const Post = require("../../model/post/Post");
const User = require('../../model/user/User');
const cloudinaryUploadImg = require("../../utils/cloudinary");


//----------------------------------
//Create post
//----------------------------------
const createPostCtrl = expressAsyncHandler(async (req, res)=>{
    console.log(req.file)
    const {_id} =req.user;
    //validateMongodbId(req.body.user);
    //check for bad words
    const filter = new Filter();
    const isProfane = filter.isProfane(req.body.title, req.body.description);
    console.log(isProfane)

    //block user
    if(isProfane){
        await User.findByIdAndUpdate(_id, {
            isBlocked: true,
        });
        throw new Error("Creating failed because it contains profane words and you have been blocked")
    }
    
    // //1. get the path to the image
    // const localPath = `public/images/posts/${req.file.filename}`;
    // //2. upload to cloudinary
    // const imgUploaded = await cloudinaryUploadImg(localPath);
    try{
        const post = await Post.create({
            ...req.body,
            // image: imgUploaded?.url, // deleted
            user: _id,
        });
        res.json(post);
        // remove uploaded images
        //fs.unlinkSync(localPath);
    } catch(error){
        res.json(error)
    }
})

//----------------------------------
//fetch all posts
//----------------------------------
const fetchPostsCtrl = expressAsyncHandler(async (req, res)=> {
    try{
        const posts = await Post.find({}).populate("user");
        res.json(posts);
    }catch(error){
        // res.json(error)
    }
    
})


//----------------------------------
//fetch a single post
//----------------------------------
const fetchPostCtrl = expressAsyncHandler(async (req, res)=> {
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const post = await Post.findById(id).populate("user").populate("disLikes");

        //update number of views
        await Post.findByIdAndUpdate(id, {
            $inc: {numViews: 1},
        },{new:true})

        res.json(post);
    }
    catch(error){
        res.json(error)
    }
})

//----------------------------------
//update posts
//----------------------------------
const updatePostCtrl = expressAsyncHandler(async (req,res)=>{
    console.log(req.user);
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const post = await Post.findByIdAndUpdate(id,{
            ...req.body,
            user: req.user?._id,
        },{
            new:true,
        });
        res.json(post);
    } catch(error){
        res.json(error)
    }
})



//----------------------------------
//delete post
//----------------------------------
const deletePostCtrl = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const post = await Post.findOneAndDelete(id);
        res.json(post);
    } catch(error){
        res.json(error);
    }
    res.json("delete");

});

//----------------------------------
//likes
//----------------------------------
const toggleAndLikeToPostCtrl = expressAsyncHandler(async (req, res)=> {
    //1. find the post to be liked
    const {postId} = req.body;
    const post = await Post.findById(postId);
    //2. find the login user 
    const loginUserId = req?.user?._id;
    //3.find if this user has liked this post
    const isLiked = post?.isLiked;
    //4. check if this user has disliked this post
    const alreadyDisliked = post?.disLikes?.find(userId => userId?.toString()===loginUserId?.toString());
    //remove the user from dislikes array if exists
    if(alreadyDisliked){
        const post = await Post.findByIdAndUpdate(postId,{
            $pull:{disLikes: loginUserId},
            isDisLiked: false,
        },{new:true});
        res.json(post);
    }
    //toggle
    //remove the user if he has liked the post
    if(isLiked){
        const post = await Post.findByIdAndUpdate(postId,{
            $pull: {likes: loginUserId},
            isLiked: false
        }, {new:true});
        res.json(post);
    }else{
        //add to likes
        const post = await Post.findByIdAndUpdate(postId,{
            $push: {likes: loginUserId},
            isLiked:true,
        },{new:true});
        res.json(post)
    }
    
})

//----------------------------------
//dislikes
//----------------------------------
const toggleAndDislikeToPostCtrl = expressAsyncHandler(async (req, res)=> {
    //1.find the post to be disliked
    const {postId} = req.body;
    const post = await Post.findById(postId);
    //2.find the login user
    const loginUserId = req?.user?._id;
    //3.check if this user is already disliked
    const isDisliked = post?.isDisLiked;
    //4.check if already liked this post
    const alreadyLiked = post?.likes?.find(userId => userId.toString()===loginUserId?.toString());
    //remove this user from likes array if exists
    if(alreadyLiked){
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: {likes: loginUserId},
            isLiked: false,
        },{new:true})
        res.json(post);
    }
    //toogling
    //remove this user from dislikes if already disliked
    if(isDisliked){
        const post = await Post.findByIdAndUpdate(postId, {
            $pull:{disLikes: loginUserId},
            isDisLiked:false,
        },{new:true});
        res.json(post);
    }
    else{
        const post = await Post.findByIdAndUpdate(postId,{
            $push: {disLikes: loginUserId},
            isDisLiked:true,
        },{new:true});
        res.json(post);
    }
});




module.exports = { createPostCtrl, fetchPostsCtrl, fetchPostCtrl,
    updatePostCtrl, deletePostCtrl,toggleAndLikeToPostCtrl,
    toggleAndDislikeToPostCtrl
}