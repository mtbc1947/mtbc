import Reference from "../models/reference.model.js";

export const getReferences = async (req, res) => {
    console.log("reference.controller, getReferences");
    const references = await Reference.find();
    res.status(200).json(references);
};

export const getPageReferences = async (req, res) => {
    let wWebPage = req.params.webPage;
    const references = await Reference.find({ webPage: wWebPage });
    let wNo = references.length || 0;
    console.log(
        "reference.controller, getPageReferences",
        wWebPage,
        `${wNo} records`
    );
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

export const updateReferences = async (req, res) => {
    const updatedRecords = req.body;

    if (!Array.isArray(updatedRecords)) {
        return res
            .status(400)
            .json({
                error: "Request body must be an array of reference records",
            });
    }

    try {
        // Use bulkWrite for efficient batch update
        const bulkOps = updatedRecords.map((record) => ({
            updateOne: {
                filter: { refKey: record.refKey },
                update: {
                    $set: {
                        webPage: record.webPage,
                        name: record.name,
                        value: record.value,
                    },
                },
                upsert: false, // do not create new if missing
            },
        }));

        if (bulkOps.length > 0) {
            await Reference.bulkWrite(bulkOps);
        }

        res.status(200).json({ message: "References updated successfully" });
    } catch (error) {
        console.error("Error updating references:", error);
        res.status(500).json({ error: "Failed to update references" });
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
