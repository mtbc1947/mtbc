import { Request, Response } from "express";
import Committee from "../models/committee.model.js";
import { CommitteeDocument } from "../types/committee.js";

import { fetchOfficersForCommittee } from "./officer.controller.js";

interface ParamsCommKey {
    commKey: string;
}

export const getAllCommittees = async (req: Request, res: Response) => {
    console.log("committee.controller, getAllCommittees");
    const committees: CommitteeDocument[] = await Committee.find().sort({
        commKey: 1,
        order: 1,
    });
    res.status(200).json(committees);
};

export const getCommittee2 = async (
    req: Request<ParamsCommKey>,
    res: Response
) => {
    const commKey = req.params.commKey;
    const committees: CommitteeDocument[] = await Committee.find({ commKey });
    console.log(
        "committee.controller, getCommittee2",
        commKey,
        `${committees.length} records`
    );
    res.status(200).json(committees);
};

export const getCommittee = async (
    req: Request<ParamsCommKey>,
    res: Response
) => {
    console.log("committee.controller, getCommittee", req.params.commKey);
    const committee: CommitteeDocument | null = await Committee.findOne({
        commKey: req.params.commKey,
    });
    res.status(200).json(committee);
};

export const createCommittee = async (
    req: Request<{}, {}, Partial<CommitteeDocument>>,
    res: Response
) => {
    console.log("committee.controller, createCommittee");
    console.log("req.body:", req.body);

    try {
        const newCommittee = new Committee(req.body);
        const savedCommittee = await newCommittee.save();

        console.log("Committee created");
        res.status(200).json(savedCommittee);
    } catch (error) {
        console.error("Committee Save Failed:", error);
        res.status(500).json({ message: "Error creating Committee", error });
    }
};

export const updateCommittee = async (
    req: Request<ParamsCommKey, {}, Partial<CommitteeDocument>>,
    res: Response
) => {
    try {
        const commKey = req.params.commKey;
        const updateData = req.body;

        console.log(
            "committee.controller, updateCommittee ",
            commKey,
            req.params
        );
        console.log(updateData);

        const updatedCommittee = await Committee.findOneAndUpdate(
            { commKey },
            updateData,
            { new: true }
        );

        if (!updatedCommittee) {
            return res.status(404).json({ message: "Committee not found" });
        }

        res.status(200).json(updatedCommittee);
    } catch (error) {
        console.error("Error updating Committee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCommittee = async (
    req: Request<ParamsCommKey>,
    res: Response
) => {
    try {
        console.log("committee.controller, deleteCommittee");
        const commKey = req.params.commKey;
        console.log(commKey);

        const relatedOfficers = await fetchOfficersForCommittee(commKey);

        if (relatedOfficers.length > 0) {
            return res.status(403).json("Committee contains Officer records");
        }

        const deletedCommittee = await Committee.findOneAndDelete({ commKey });

        if (!deletedCommittee) {
            return res.status(403).json("You can only delete your own data");
        }

        return res.status(200).json("Committee has been deleted");
    } catch (error) {
        console.error("Error in deleteCommittee:", error);
        return res.status(500).json("Internal server error");
    }
};
