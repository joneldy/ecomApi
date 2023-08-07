const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();

//Get all Method
router.get("/users", async (req, res) => {
  try {
    const data = await UserModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/users/:id", async (req, res) => {
  console.log("params", req.params);
  try {
    const data = await UserModel.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//save user
router.post("/users", async (req, res) => {
  console.log("req", req.payload);
  try {
    const payload = req.body;
    const instance = new UserModel({ name: payload.name, age: payload.age });
    const result = await instance.save();
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await UserModel.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await UserModel.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
