import jwt from "jsonwebtoken";
import AdminModel from "../../DB/models/admin_model.js";
import ClientModel from "../../DB/models/client_model.js";
import FreelancerModel from "../../DB/models/freelancer_model.js";

const auth = (data) => {
  return async (req, res, next) => {
    try {
      const headerToken = req.headers.token;
      const bearerKey = process.env.BEARER_KEY || "Bearer";

      if (!headerToken || !headerToken.startsWith(bearerKey)) {
        return res.status(401).json({ msg: "Invalid header token" });
      }

      const token = headerToken.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRETkEY);
      let user;

      if (!decoded) {
        return res.status(401).json({ msg: "invalid or expired token" });
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

      if (!user) {
        return res.status(401).json({ msg: "invalid or expired token" });
      }

      if (token !== user.token) {
        return res.status(403).json({ msg: "You are not authorized" });
      }

      const allowedRoles = Array.isArray(data) ? data : [];

      if (allowedRoles.includes(user.role)) {
        req.user = user;
        req.auth = { token, decoded };
        return next();
      }
      return res.status(403).json({ msg: "You are not authorized" });
    } catch (error) {
      if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError"
      ) {
        return res.status(401).json({ msg: "invalid or expired token" });
      }

      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };
};

export default auth;
