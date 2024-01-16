import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRounter = Router();

questionRounter.get("/", async (req, res) => {
  try {
    const title = req.query.title;
    const category = req.query.category;
    const query = {};

    if (title) {
      query.title = new RegExp(title, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }

    const collection = db.collection("questions");
    const questions = await collection.find(query).limit(10).toArray();

    return res.json({ data: questions });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRounter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);

    const questionById = await collection.findOne({ _id: questionId });

    return res.json({ data: questionById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRounter.post("/", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionData = { ...req.body, created_at: new Date() };
    const newQuestionData = await collection.insertOne(questionData);

    return res.json({
      message: `Question ${newQuestionData.insertedId} has been created successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRounter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const newQuestionData = { ...req.body, modified_at: new Date() };

    const questionId = new ObjectId(req.params.id);

    await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: newQuestionData,
      }
    );
    return res.json({
      message: `Question ${questionId} has been updated successfully `,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRounter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionId = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: questionId });

    return res.json({
      message: `Question ${questionId} has been deleted successfully`,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

export default questionRounter;
