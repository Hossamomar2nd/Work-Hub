
import category from "../../../DB/models/category_model.js";

// Get All Categories
export const getAllCategories = async (req, res) => {
    try {
        const allCategories = await category.find();

        if(allCategories.length !== 0) {
            return res.status(200).json(allCategories);
        }
        res.status(404).json({msg:"No categories found!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Somthing went wrong!"});
    }
}

// Add Category
export const addCategory = async (req, res) => {
    try {
        const categoryName = {categoryName: req.body.categoryName};
        const data = await category.find(categoryName);

        if(data.length === 0){
            const newCategory = new category({
                ...req.body,
            });
    
            await newCategory.save();
            return res.status(200).json({msg:"Category has been created successfuly."});
        }
        res.status(404).json("Category is already exists.");
    } catch (error) {
        console.log(error);
        res.status(500).json("Somthing went wrong!");
    }
}

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryToUpdate = await category.findById(categoryId);

        if(categoryToUpdate) {
            const filter = { _id: categoryId };
            const update = { $set: { categoryName: req.body.categoryName, categoryDesc: req.body.categoryDesc} };
            await category.updateOne(filter, update);
    res.status(200).json({msg:"Category has been updated successfuly."});
        }
        else {
            res.status(404).json({msg:"There is no category with such id to update."});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Somthing went wrong!"});
    }
}

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const categoryToDelete = await category.findById(categoryId);

        if(categoryToDelete){

            const filter = { _id: categoryId };

            await category.deleteOne(filter);
            res.status(200).json({msg:"Category has been deleted successfuly."});
        }
        else {
            res.status(404).json({msg:"Category deletion failed."});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Somthing went wrong!"});
    }
}