const express = require("express")
const hubs = require("../hubs/hubs-model.js")

const router = express.Router({ mergeParams: true, }) //look up mergeParams

//get all messages
router.get("/", (req, res) => {
    /*     console.log(req.params)
        res.end() */
    hubs.findHubMessages(req.params.id)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).json({
                message: "Could not get hub messages"
            })
        })
})

//params and url ID cannot be the same
router.get("/:messageId", (req, res) => {
    hubs.findHubMessageById(req.params.id, req.params.messageId)
        .then(data => {
            if (data) {
                res.json(data)
            } else {
                res.status(404).json({
                    message: "message not found!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "couldn't get hub message (singular)"
            })
        })
})

router.post("/", (req, res) => {
    if (!req.body.sender || !req.body.text) {
        return res.status(400).json({
            message: "need Sender and Message!"
        })
    }

    //you could send through the entire body but it is better to whitelist
    // and specify the info
    const newMessage = {
        sender: req.body.sender,
        text: req.body.text,
    }

    hubs.addHubMessage(req.params.id, newMessage)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(500).json({
                message: "Could not create hub message"
            })
        })
})

module.exports = router

