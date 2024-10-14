const roles = require("../../middleware/roles");

const endPoint={
    createPost:[roles.client,roles.freelancer],
    createlike:[roles.client,roles.freelancer],
    createcomment:[roles.client,roles.freelancer],
}
module.exports=endPoint;