
import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
    communityId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "community"
    },
    posterId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    posterType: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    media_url: {
        type: String,
        required: false
    },
    likes: {
        type: [mongoose.Types.ObjectId],
        required: false,
    },
    comments: {
        type: [Object],
    },
    creationDate: {
        type: String,
    }
},{
    timestamps: true
});

export default mongoose.model("post", postSchema);




// import mongoose from 'mongoose';
// const { Schema } = mongoose;


// const replySchema=new Schema({
//     replyedByClient: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'client'  // Array of model names
//     },
//     replyedByFreelancer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'freelancer'  // Array of model names
//     },
//     desc:String,
//     likesClient:[{type:mongoose.Schema.Types.ObjectId,ref:'client'}],
//     likesFreelancer:[{type:mongoose.Schema.Types.ObjectId,ref:'freelancer'}],
//     images:Array,
    
// })





// const commentSchema=new Schema({
//     createdByClient: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'client' // Array of model names
//     },
//     createdByFreelancer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'freelancer' // Array of model names
//     },
//     images:Array,
//     tagsClient:[{type:mongoose.Schema.Types.ObjectId,ref:'client'}],
//     tagsfreelancer:[{type:mongoose.Schema.Types.ObjectId,ref:'freelancer'}],
//     desc:String,
//     likesClient: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'client'  // Array of model names
//     },
//         likesFreelancer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'freelancer'  // Array of model names
//     },

//     images:Array,
//     isDeleted:{type:Boolean,default:false},
//     DeletedByFreelancer:{type:mongoose.Schema.Types.ObjectId,ref:'freelancer'},
//     DeletedByClient:{type:mongoose.Schema.Types.ObjectId,ref:'client'},
 
//     reply:[replySchema]
// })


// const postSchema = new Schema({
//     createdByClient: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'client'  // Array of model names
//     },
//     createdByFreelancer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'freelancer'  // Array of model names
//     },
//     // communityId: {
//     //     type: Number,
//     //     required: true
//     // },
//     posterId: {
//         type: Number,
//         required: false,
//     },
//     posterType: {
//         type: String,
//         required: false
//     },
//     caption: {
//         type: String,
//         required: true
//     },
//     tagsClient: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
//     tagsFreelancer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' }],

//     images:Array,
//     likesClient:[ {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'client'  // Array of model names
//     }],
//     likesFreelancer:[ {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'freelancer'  // Array of model names
//     }],
//     comment:[commentSchema]

// },{
//     timestamps: true
// });

// export default mongoose.model("post", postSchema);

