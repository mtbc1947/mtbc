import { Request, Response } from "express";
import Member from "../models/member.model.js";
import { MemberDocument } from "../types/member.js";

import { fetchOfficersForMember } from "./officer.controller.js";

interface ParamsId {
    id: string;
}

export const getAllMembers = async (req: Request, res: Response) => {
    console.log("member.controller, getAllMembers");
    const members: MemberDocument[] = await Member.find().sort({
        lastName: 1,
        firstName: 1,
    });
    res.status(200).json(members);
};

export const getMember2 = async (req: Request<ParamsId>, res: Response) => {
    const memberId = req.params.id;
    const members: MemberDocument[] = await Member.find({ _id: memberId });
    console.log(
        "member.controller, getMember2",
        memberId,
        `${members.length} records`
    );
    res.status(200).json(members);
};

export const getMember = async (req: Request<ParamsId>, res: Response) => {
    console.log("member.controller, getMember", req.params.id);
    const member: MemberDocument | null = await Member.findOne({
        _id: req.params.id,
    });
    res.status(200).json(member);
};

export const createMember = async (
    req: Request<{}, {}, Partial<MemberDocument>>,
    res: Response
) => {
    console.log("member.controller, createMember");
    console.log("req.body:", req.body);

    try {
        const newMember = new Member(req.body);
        const savedMember = await newMember.save();

        console.log("member created");
        res.status(200).json(savedMember);
    } catch (error) {
        console.error("member Save Failed:", error);
        res.status(500).json({ message: "Error creating member", error });
    }
};

export const updateMember = async (
    req: Request<ParamsId, {}, Partial<MemberDocument>>,
    res: Response
) => {
    try {
        const memberId = req.params.id;
        const updateData = req.body;
        console.log("member.controller, updateMember ", memberId, req.params);
        console.log(updateData);

        const updatedMember = await Member.findOneAndUpdate(
            { _id: memberId },
            updateData,
            { new: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json(updatedMember);
    } catch (error) {
        console.error("Error updating Member:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteMember = async (req: Request<ParamsId>, res: Response) => {
    console.log("member.controller, deleteMember");
    const memberId = req.params.id;
    console.log(memberId);

    const relatedOfficers = await fetchOfficersForMember(memberId);

    if (relatedOfficers.length > 0) {
        return res.status(403).json("Member still holds Officer positions");
    }

    const deletedMember = await Member.findByIdAndDelete(memberId);

    if (!deletedMember) {
        return res.status(403).json("You can only delete your own data");
    }

    res.status(200).json("Member has been deleted");
};
