import Reference from "../models/reference.model.js";

export const getReferences = async (req, res) => {
    console.log("reference.controller, getReferences");
    const references = await Reference.find();
    res.status(200).json(references);
};

export const getPageReferences = async (req, res) => {
    console.log("reference.controller, getPageReferences", req.params.webPage);
    const references = await Reference.find({ webPage: req.params.webPage });
    console.log(`Found ${references.length} records`);
    res.status(200).json(references);
};

export const getReference = async (req, res) => {
    console.log("references.controller, getReference", req.params.refKey);
    const reference = await Reference.findOne({ refKey: req.params.refKey });
    res.status(200).json(reference);
};

export const createReference = async (req, res) => {
    console.log("reference.controller, createReference");
    console.log("Controller req");
    console.log(req);

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();
    let existingReference = await Reference.findOne({ slug });
    let counter = 2;
    while (existingReference) {
        slug = `${slug}-${counter}`;
        existingReference = await Reference.findOne({ slug });
        counter++;
    }

    const newReference = new Reference({ slug: slug, ...req.body });

    const reference = await newReference.save();
    if (reference) {
        console.log("reference created");
        res.status(200).json(reference);
    } else {
        console.log("reference Save Failed");
        res.status(500).json({
            message: "Error creating reference",
        });
    }
};

export const deleteReference = async (req, res) => {
    console.log("reference.controller, deleteReference");

    const deletedReference = await Reference.findByIdAndDelete({
        _id: req.params.id,
    });

    if (!deletedReference) {
        res.status(403).json("You can only delete your own references");
    }

    res.status(200).json("reference has been deleted");
};
