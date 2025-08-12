import { Request, Response } from "express";
import mongoose from "mongoose";

import Officer from "../models/officer.model";
import { OfficerDocument } from "../types/officer";

/** Get all officers, populated with member names */
export const getAllOfficers = async (req: Request, res: Response) => {
    console.log("Officer.controller, getAllOfficers");

    try {
        const officers: OfficerDocument[] = await Officer.find()
            .populate("holderId")
            .sort({ commKey: 1, order: 1 })
            .exec();
        res.status(200).json(officers);
    } catch (err) {
        console.error("Error fetching officers:", err);
        res.status(500).json({ error: "Server error fetching officers" });
    }
};

/** Get officer by ID (variant 1) */
export const getOfficer = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    console.log("officer.controller, getOfficer", req.params.id);
    try {
        const officer: OfficerDocument | null = await Officer.findById(
            req.params.id
        );
        res.status(200).json(officer);
    } catch (err) {
        res.status(500).json({ error: "Error fetching officer" });
    }
};

/** Get officer by ID (variant 2) */
export const getOfficer2 = async (
    req: Request<{ _id: string }>,
    res: Response
) => {
    const id = req.params._id;
    try {
        const officers: OfficerDocument[] = await Officer.find({ _id: id });
        console.log(
            "officer.controller, getOfficer2",
            id,
            `${officers.length} records`
        );
        res.status(200).json(officers);
    } catch (err) {
        res.status(500).json({ error: "Error fetching officer" });
    }
};

/** Fetch officers for committee (internal use) */
export async function fetchOfficersForCommittee(
    commKey: string
): Promise<OfficerDocument[]> {
    return await Officer.find({ commKey });
}

/** Fetch officers for member (internal use) */
export async function fetchOfficersForMember(
    holderId: mongoose.Types.ObjectId | string
): Promise<OfficerDocument[]> {
    return await Officer.find({ holderId });
}

/** Get officers for committee (API) */
export async function getOfficersForCommittee(
    req: Request<{ commKey: string }>,
    res: Response
) {
    try {
        const commKey = req.params.commKey;
        console.log("getOfficersForCommittee - commKey =", commKey);

        const officers = await fetchOfficersForCommittee(commKey);
        console.log(`Found ${officers.length} officers`);

        res.status(200).json(officers);
    } catch (error) {
        console.error("Error in getOfficersForCommittee:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

/** Create officer */
export const createOfficer = async (
    req: Request<{}, {}, Partial<OfficerDocument>>,
    res: Response
) => {
    try {
        const officer = new Officer(req.body);
        await officer.save();
        res.status(201).json(officer);
    } catch (err) {
        console.log("Failed to create officer", err);
        res.status(500).json({ error: "Failed to create officer" });
    }
};

/** Update officer */
export const updateOfficer = async (
    req: Request<{ id: string }, {}, Partial<OfficerDocument>>,
    res: Response
) => {
    try {
        const officer = await Officer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(officer);
    } catch (err) {
        console.log("Failed to update officer", err);
        res.status(500).json({ error: "Failed to update officer" });
    }
};

/** Delete officer */
export const deleteOfficer = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    console.log("Officer.controller, deleteOfficer");

    try {
        const deletedOfficer = await Officer.findByIdAndDelete(req.params.id);

        if (!deletedOfficer) {
            return res
                .status(404)
                .json({ error: "Officer not found for deletion" });
        }

        res.status(200).json({ message: "Officer has been deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete officer" });
    }
};
