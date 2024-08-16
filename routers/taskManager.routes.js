const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    TASKMANAGER: { APIS, VALIDATOR },
} = require("../controllers");

/* Get Apis */
router.get("/:id?", auth, APIS.getTasks);

/* Post Apis */
router.post("/", auth, VALIDATOR.createTasks, APIS.createTask);

/* Put Apis */
router.put("/:id", auth, VALIDATOR.updateTask, APIS.updateTask);

/* Delete Apis */
router.delete("/:id", auth, VALIDATOR.deleteTask, APIS.deleteTask);

module.exports = router;
