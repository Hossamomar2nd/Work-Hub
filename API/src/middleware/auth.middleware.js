
import jwt from 'jsonwebtoken'
import AdminModel from '../../DB/models/admin_model.js'
import ClientModel from '../../DB/models/client_model.js'
import FreelancerModel from '../../DB/models/freelancer_model.js'


const auth = (data) => {
  return async (req, res, next) => {
    try {
      const headerToken = req.headers.token;

      if (!headerToken || !headerToken.startsWith(process.env.BEARER_KEY)) {
        return res.status(400).json({ msg: "Invalid header token" });
      }

      const token = headerToken.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRETkEY);
    //   console.log(decoded);
      let user;

      if (!decoded) {
        return res.status(400).json({ msg: "invalid or expired token" });
      }

      switch (decoded.role) {
        case "admin":
          user = await AdminModel.findOne({ _id: decoded.userId });
          break;
        case "client":
          user = await ClientModel.findOne({ _id: decoded.userId });
          break;
        case "freelancer":
          user = await FreelancerModel.findOne({ _id: decoded.userId });
          break;
        default:
          return res.status(400).json({ msg: "Role undefined" });
      }

      if(token !== user.token) {
        return res.status(400).json({ msg: "You are not authorized" });
      }

      if (data.includes(user.role)) {
        if (user.activityStatus === "online") {
          return next();
        }
        return res.status(403).json({ msg: "You are not authenticated" });
      }
      res.status(403).json({ msg: "You are not authorized" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
};

export default auth