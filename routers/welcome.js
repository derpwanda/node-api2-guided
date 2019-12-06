const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
    res.send("<h2>Welcome to the Lambda Hubs API</h>")
})

router.get("/api", (req, res) => {
    res.json({ message: "Welcome to the Hubs API" })
})

module.exports = router