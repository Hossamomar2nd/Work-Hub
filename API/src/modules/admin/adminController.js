
import bcrypt from 'bcrypt'
import AdminModel from '../../../DB/models/admin_model.js'
import { validatePassword } from '../../middleware/val.middleware.js';

// Get All Admins
export const getAllAdmins = async (req, res) => {
    try {
        const allAdmins = await AdminModel.find();
        if(allAdmins.length !== 0) {
            res.status(200).send(allAdmins);
        }
        else {
            res.status(400).json({ msg: "No admins found!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Somthing went wrong!");
    }
}

// Add Admin
export const addAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin with given email already exists
        const admin = await AdminModel.findOne({ email });
        if (admin) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));

        // Create a new admin instance
        const newAdmin = new AdminModel({
            name,
            email,
            password: hashedPassword
        });

        // Save the new admin to the database
        await newAdmin.save();

        // Generate token for the new admin

        // Send response with token
        res.status(200).json({ msg: 'Admin added successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error',error });
    }
};

// Update Admin Info
export const updateAdminInfo = async (req, res) => {
    try {
        const adminId = req.params.id;
        console.log(adminId);
        const adminToUpdate = await AdminModel.findById(adminId);

        if(adminToUpdate) {
            const adminEmail = {email: req.body.email};
            const adminData = await AdminModel.find(adminEmail);
            console.log(adminData);

            let condition = adminData.length === 0;

            if(!condition) {
                condition = adminData[0].email === req.body.email;
            }

            if(condition) {
                const filter = { _id: adminId };
                const update = { $set: { username: req.body.username, email: req.body.email, image_url: req.body.image_url } }
                await AdminModel.updateOne(filter, update);
                return res.status(200).send("Admin has been updated successfuly.");
            }
            return res.status(400).send("You cannot use this email.");
        }
        res.status(200).send("There is no Admin with such id to update.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Somthing went wrong!");
    }
}

// Update Admin Password
export const updateAdminPassword = async (req, res) => {
    try {
        const adminId = req.params.id;
        console.log(adminId);
        const adminToUpdate = await AdminModel.findById(adminId);

        if(adminToUpdate) {
                if(adminData.includes(req.body.password)) {
                    const passwordInput = req.body.adminPassword;
                    const adminPassword = data[0].adminPassword;
                    const match = await bcrypt.compare(passwordInput, adminPassword);

                    if(match){
                        const newPassword = req.body.adminNewPassword;
                        const confirmNewPassword = req.body.adminConfirmNewPassword;

                        const newMatch = await bcrypt.compare(newPassword, adminPassword);
                        
                        if(!newMatch){
                            if(newPassword === confirmNewPassword) {
                                const filter = { _id: adminId };
                                if(validatePassword(newPassword)){
                                    const newPasswordHash = bcrypt.hashSync(newPassword, process.env.SALT_ROUND);
                                    const update = { $set: { Password: newPasswordHash, token: "null" } };
                
                                    await AdminModel.updateOne(filter, update);
                                    return res.status(200).send("Admin has been updated successfuly.");
                                }
                                return res.status(400).send("Password is not valid. Please follow the password pattern.");
                            }
                            return res.status(400).send("Passwords don't match.");
                        }
                        return res.status(400).send("You cannot use your current password as new password.");
                    }
                    return res.status(400).send("Wrong password.");
                }
                const filter = { _id: adminId };
                const update = { $set: { username: req.body.username, email: req.body.email, image_url: req.body.image_url } }
                await AdminModel.updateOne(filter, update);
                return res.status(200).send("Admin has been updated successfuly.");
        }
        res.status(200).send("There is no Admin with such id to update.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Somthing went wrong!");
    }
}

// Upload Admin Image
export const uploadAdminImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(404).send({ success: false, message: "Image is required" });
        }

        const id = req.params.id;

        if (id == undefined) {
            return res.status(404).send({ success: false, message: "id is required" });
        }

        const cover_url = req.file.filename;

        const filter = { _id: id };
        const update = { $set: { image_url: cover_url } };

        await AdminModel.updateOne(filter, update);

        res.status(200).json({ msg: "image uploaded successfuly" });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "Server Error" });
    }
};


// Delete Admin
export const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id
        const adminToDelete = await AdminModel.findById(adminId);

        if(adminToDelete){
            const filter = { _id: adminId };

            await AdminModel.deleteOne(filter);
            return res.status(200).json({ msg: "Admin has been deleted successfuly."});
        }
        return res.status(400).json({ msg: "Admin deletion failed!"});
    } catch (error) {
        console.log(error);
        res.status(500).send("Somthing went wrong!");
    }
}