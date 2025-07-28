import RefData from "../models/refData.model.js";

export const getAllRefData = async (req, res) => {
    console.log("refData.controller, getAllRefData");
    const refData = await RefData.find();
    res.status(200).json(refData);
};

export const getPageRefData = async (req, res) => {
    let wWebPage = req.params.webPage;
    const refData = await RefData.find({ webPage: wWebPage });
    let wNo = refData.length || 0;
    console.log(
        "refData.controller, getPageRefData",
        wWebPage,
        `${wNo} records`
    );
    res.status(200).json(refData);
};

export const getRefData = async (req, res) => {
    console.log("refData.controller, getRefData", req.params.refKey);
    const refData = await RefData.findOne({ refKey: req.params.refKey });
    res.status(200).json(refData);
};

export const createRefData = async (req, res) => {
    console.log("refData.controller, createRefData");
    console.log("req.body:", req.body);

    try {
        const newRefData = new RefData(req.body);
        const savedRefData = await newRefData.save();

        console.log("refData created");
        res.status(200).json(savedRefData);
    } catch (error) {
        console.error("refData Save Failed:", error);
        res.status(500).json({ message: "Error creating refData", error });
    }
};

export const updateRefData = async (req, res) => {
    try {
        const refKey = req.params.refKey; // this is actually the custom eventId
        const updateData = req.body;
        console.log("refData.controller, updateRefData ", refKey, req.params);
        console.log(updateData);

        const updatedRefData = await RefData.findOneAndUpdate(
            { refKey: refKey },
            updateData,
            { new: true }
        );

        if (!updatedRefData) {
            return res.status(404).json({ message: "RefData not found" });
        }

        res.status(200).json(updatedRefData);
    } catch (error) {
        console.error("Error updating RefData:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateAllRefData = async (req, res) => {
    const updatedRecords = req.body;

    if (!Array.isArray(updatedRecords)) {
        return res.status(400).json({
            error: "Request body must be an array of refData records",
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
            await RefData.bulkWrite(bulkOps);
        }

        res.status(200).json({ message: "RefData updated successfully" });
    } catch (error) {
        console.error("Error updating refData:", error);
        res.status(500).json({ error: "Failed to update refData" });
    }
};

export const deleteRefData = async (req, res) => {
    console.log("refData.controller, deleteRefData");

    const deletedRefData = await RefData.findByIdAndDelete({
        _id: req.params.id,
    });

    if (!deletedRefData) {
        res.status(403).json("You can only delete your own refData");
    }

    res.status(200).json("refData has been deleted");
};
