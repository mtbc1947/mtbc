import Event from "../models/event.model.js";

export const getEvents = async (req, res) => {
    console.log("event.controller, getEvents");
    const events = await Event.find();
    res.status(200).json(events);
};
