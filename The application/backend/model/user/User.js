const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const crypto = require("crypto")

//create schema

const userSchema = new mongoose.Schema({
    firstName: {
        required: [true, "First name is required"],
        type: String,
    },
    lastName: {
        required: [true, "Last name is required"],
        type: String,
    },
    profilePhoto: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png',

    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    postCount: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum:["Admin","Guest","Blogger"],
    },
    isFollowing: {
        type: Boolean,
        default: false,
    },
    isUnFollowing: {
        type: Boolean,
        default: false,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    followers: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    following: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    active: {
        type: Boolean,
        default: false, 
    },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    }
);

//virtual method to populate created posts
userSchema.virtual("posts",{
    ref:"Post",
    foreignField: "user",
    localField : "_id",
});




//Hash password

userSchema.pre("save",async function(next) {
    if(!this.isModified("password")){
        next();
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Verify account 
userSchema.methods.createAccountVerificationToken = async function(){
    // create a token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    this.accountVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex")
    this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000 //10 minutes
    return verificationToken
}


//Password reset/forget
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000 // 10 minutes
    return resetToken;
}



//Compile schema to model
const User = mongoose.model('User', userSchema);

module.exports = User;