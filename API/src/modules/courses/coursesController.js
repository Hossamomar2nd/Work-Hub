
import course from "../../../DB/models/course_model.js";
import freelancer_model from "../../../DB/models/freelancer_model.js";
import Client_Model from "../../../DB/models/client_model.js"

// Get All courses
export const getAllCourses = async (req, res) => {
    try {
        const allCourses = await course.find().populate("categoryId");

        if (allCourses.length == 0) {
            return res.status(404).json({ msg: "No Courses Found!" });
        }

        const modifiedCourses = allCourses.map((course) => {
            const modifiedCourse = { ...course._doc }; // Create a copy of the service object
            modifiedCourse.courseCoverImage_url = "http://" + req.hostname + ":3000/" + modifiedCourse.courseCoverImage_url;
            modifiedCourse.proffImage_url = "http://" + req.hostname + ":3000/" + modifiedCourse.proffImage_url;
            return modifiedCourse;
        });

        res.status(200).json({ modifiedCourses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Get Course By ID
export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const courseData = await course.findById(courseId).populate("categoryId");

        if (!courseData) {
            return res.status(404).json({ msg: "No Courses Found!" });
        }
        

        courseData.proffImage_url = "http://" + req.hostname + ":3000/" + courseData.proffImage_url;

        res.status(200).json({ courseData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Get Courses By Category ID
export const getCoursesByCategoryId = async (req, res) => {
    try {
        const id = req.params.id;
        const coursesData = await course.find({ categoryId: id}).populate("categoryId");

        if (!coursesData[0]) {
            return res.status(404).json({ msg: "No Courses Found!" });
        }

        const modifiedCourses = coursesData.map((course) => {
            const modifiedCourse = { ...course._doc }; // Create a copy of the service object
            modifiedCourse.courseCoverImage_url = "http://" + req.hostname + ":3000/" + modifiedCourse.courseCoverImage_url;
            modifiedCourse.proffImage_url = "http://" + req.hostname + ":3000/" + modifiedCourse.proffImage_url;
            return modifiedCourse;
        });

        res.status(200).json({ modifiedCourses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Get Courses By Freelancer ID Or Client ID
export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.params.userId;
        const role = req.params.role;
    
        const allCourses = await course.find();

        const modifiedCourses = allCourses.map((course) => {
            const modifiedCourse = { ...course._doc }; // Create a copy of the service object
            modifiedCourse.courseCoverImage_url = "http://" + req.hostname + ":3000/" + modifiedCourse.courseCoverImage_url;
            modifiedCourse.proffImage_url = "http://" + req.hostname + ":3000/" + modifiedCourse.proffImage_url;
            return modifiedCourse;
        });
    
        const coursesData = [];
        // const coursesIds = [];

        if (role == "freelancer") {
            modifiedCourses.map((course) => {
                course.enrolledFreelancersIds.filter((id) => {
                    if (id == userId) {
                        coursesData.push(course);
                    }
                })
            })
        }

        if(role == "client") [
            modifiedCourses.map((course) => {
                course.enrolledClientsIds.filter((id) => {
                    if (id == userId) {
                        coursesData.push(course);
                    }
                })
            })
        ]
    
        if(role !== "client" && role !== "freelancer") {
            return res.status(404).json({ msg: "Invalid role!" });
        }


        if (coursesData.length == 0) {
            return res.status(404).json({ msg: "No Courses Found!" });
        }
    
        res.status(200).json({ coursesData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Enroll In a Course
export const enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const freelancerId = req.params.userId;
        const clientId = req.params.userId;
        const role = req.params.role;
        const courseData = await course.findById(courseId);

        if(!courseData) {
            return res.status(404).json({ msg: "Course not found!" });
        }

        if(role == "freelancer") {
            if(freelancerId == undefined) {
                return res.status(404).json({ msg: "Freelancer id is required!" });
            }

            const freelancerData = await freelancer_model.findById(freelancerId);

            if(!freelancerData) {
                return res.status(404).json({ msg: "Freelancer not found!" });
            }
    
            const enrollCourses = courseData.enrolledFreelancersIds;

            let actualData = [];

            enrollCourses.filter((id) => {
                if (id == freelancerId) {
                    actualData.push(freelancerId);
                }
            })

            if(actualData.length !== 0) {
                return res.status(400).json({ msg: "You already enrolled in this course!" });
            }
    
            enrollCourses.push(freelancerId);
    
            const filter = { _id: courseId };
    
            const update = { $set: { enrolledFreelancersIds: enrollCourses} }
    
            await course.updateOne(filter, update);
        }

        if(role == "client") {
            if(clientId == undefined) {
                return res.status(404).json({ msg: "Client id is required!" });
            }

            const clientData = await Client_Model.findById(clientId);

            if(!clientData) {
                return res.status(404).json({ msg: "Client not found!" });
            }
    
            const enrollCourses = courseData.enrolledClientsIds;
    
            enrollCourses.push(clientId);
    
            const filter = { _id: courseId };
    
            const update = { $set: { enrolledClientsIds: enrollCourses} }
    
            await course.updateOne(filter, update);
        }

        if(role !== "client" && role !== "freelancer") {
            return res.status(404).json({ msg: "Invalid role!" });
        }

        res.status(200).json({ msg: "Course has been enrolled successfuly." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Unenroll In a Course
export const unenrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.params.userId;
        const role = req.params.role;
        const courseData = await course.findById(courseId);

        if(!courseData) {
            return res.status(404).json({ msg: "Course not found!" });
        }

        if(role == "freelancer") {
            if(userId == undefined) {
                return res.status(404).json({ msg: "Freelancer id is required!" });
            }

            const freelancerData = await freelancer_model.findById(userId);

            if(!freelancerData) {
                return res.status(404).json({ msg: "Freelancer not found!" });
            }
    
            const enrolledCourses = courseData.enrolledFreelancersIds;

            let actualData = [];

            enrolledCourses.filter((id) => {
                if (id.valueOf() == userId) {
                    actualData.push(userId);
                }
            })

            if(actualData.length == 0) {
                return res.status(400).json({ msg: "You are not enrolled in this course!" });
            }

            let data = [];
    
            enrolledCourses.filter((id) => {
                if (id.valueOf() !== userId) {
                    data.push(id);
                }
            })
                
            const filter = { _id: courseId };
    
            const update = { $set: { enrolledFreelancersIds: data} }
    
            await course.updateOne(filter, update);
        }

        if(role == "client") {
            if(userId == undefined) {
                return res.status(404).json({ msg: "Client id is required!" });
            }

            const clientData = await Client_Model.findById(userId);

            if(!clientData) {
                return res.status(404).json({ msg: "Client not found!" });
            }
    
            const enrollCourses = courseData.enrolledClientsIds;
    
            let actualData = [];

            enrollCourses.filter((id) => {
                if (id.valueOf() == userId) {
                    actualData.push(userId);
                }
            })

            if(actualData.length == 0) {
                return res.status(400).json({ msg: "You are not enrolled in this course!" });
            }
    
            let data = [];

            enrollCourses.filter((id) => {
                if (id.valueOf() != userId) {
                    data.push(userId);
                }
            })
    
            const filter = { _id: courseId };
    
            const update = { $set: { enrolledClientsIds: data} }
    
            await course.updateOne(filter, update);
        }

        if(role !== "client" && role !== "freelancer") {
            return res.status(404).json({ msg: "Invalid role!" });
        }

        res.status(200).json({ msg: "Course has been unenrolled successfuly." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Add Course
export const addCourse = async (req, res) => {
    try {
        const courseTitle = { courseTitle: req.body.courseTitle };
        const data = await course.find(courseTitle);
    
        if (data.length !== 0) {
            return res.status(404).json({ msg: "Course has been Already Created!", newCourse });
        }
    
        const newCourse = new course({
            ...req.body,
        })

        await newCourse.save();
        return res.status(200).json({ msg: "course has been created successfuly.", newCourse });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg:"Somthing went wrong!" });
    }
}

// Update course
export const updateCourse = async (req, res) => {

    const courseId = req.params.id;
    const iscourse = await course.findById(courseId);

    if (!iscourse) {
        return next(new Error("courses Not found", { cause: 404 }));
    }
  
    const updatedcourse = await course.findByIdAndUpdate(courseId, req.body, { new: true });
    return res.status(200).json({ msg: "courses has been updated successfuly.", updatedcourse });
}

// Delete courses
export const deleteCourse = async (req, res) => {

    const courseId = req.params.id
    const isCourse = await course.findById(courseId);

    if (isCourse) {
        const filter = { _id: courseId };

        await course.deleteOne(filter);
        res.status(200).json({ msg: "course has been deleted successfuly." });
    }
    else {
        return next(new Error("course not found.", { cause: 404 }));
    }

}

// Upload Course Cover Image
export const uploadCourseCoverImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(404).json({ success: false, msg: "Cover image is required" });
        }

        const id = req.params.id;

        if (id == undefined) {
            return res.status(404).json({ success: false, msg: "id is required" });
        }

        const cover_url = req.file.filename;

        const filter = { _id: id };
        const update = { $set: { courseCoverImage_url: cover_url } };

        await course.updateOne(filter, update);

        res.status(200).json({ msg: "image uploaded successfuly" });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "Server Error" });
    }
};

// Upload Proffessor Image
export const uploadProffImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(404).json({ success: false, message: "Cover image is required" });
        }

        const id = req.params.id;

        if (id == undefined) {
            return res.status(404).json({ success: false, message: "id is required" });
        }

        const cover_url = req.file.filename;

        const filter = { _id: id };
        const update = { $set: { proffImage_url: cover_url } };

        await course.updateOne(filter, update);


        res.status(200).json({ msg: "image uploaded successfuly" });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "Server Error" });
    }
};

