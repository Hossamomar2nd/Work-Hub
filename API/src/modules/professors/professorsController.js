
import professors from "../../../DB/models/professor_model.js";

// Get All Professors
export const getAllProfessors = async (req, res) => {

    const allProfessors = await professors.find();
    if (allProfessors.length == 0) {
        return res.status(400).json({ msg:"Professors Not found!" })
    }

    res.status(200).json({ allProfessors });
}

// Add professor
export const addProfessor = async (req, res) => {

    const professorsName = { proffName: req.body.proffName };
    const data = await professors.find(professorsName);

    if (data.length !== 0) {
        return res.status(400).json({ msg:"This professor is already exists!" })
    }

    const newProfessor = new professors({
        ...req.body,
    })

    await newProfessor.save();

    return res.status(200).json({ msg: "Professors has been created successfuly.", newProfessor });
}

// Update professor
export const updateProfessor = async (req, res) => {

    const proffId = req.params.id;
    const isProfessor = await professors.findById(proffId);

    if (!isProfessor) {
        return res.status(400).json({ msg:"Professor Not found" })
    }
  
    const updatedProfessor = await professors.findByIdAndUpdate(proffId, req.body, { new: true });
    return res.status(200).json({ msg: "Professor has been updated successfuly.", updatedProfessor });
}

// Delete Professors
export const deleteProfessors = async (req, res) => {

    const proffId = req.params.id
    const isProfessor = await professors.findById(proffId);

    if (isProfessor) {
        const filter = { _id: proffId };

        await professors.deleteOne(filter);
        res.status(200).json({ msg: "Proffessors has been deleted successfuly." });
    }
    else {
        return res.status(400).json({ msg:"Professor Not found" });
    }

}