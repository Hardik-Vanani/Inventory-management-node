const response = require("../../helpers/response.helper");
const DB = require("../../models");
const {
    USER_TYPE: { ADMIN },
} = require("../../json/enum.json");

module.exports = {
    /* Get Task Manager API */
    getTasks: async (req, res) => {
        try {
            // check if id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, user_id: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { user_id: req.user.id, ...req.query };

            const taskData = await DB.taskManager.find(filter).select("-user_id");

            return response.OK({ res, count: taskData.length, payload: { taskData } });
        } catch (error) {
            console.error("Error getting tasks: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create Task manager API */
    createTask: async (req, res) => {
        try {
            // Create new task
            const taskData = await DB.taskManager.create({
                ...req.body,
                user_id: req.user.id,
            });
            return response.CREATED({ res, payload: { taskData } });
        } catch (error) {
            console.error("Error creating task: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update Task Manager API */
    updateTask: async (req, res) => {
        try {
            // Find for the task and update it
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, user_id: req.user.id };
            const updateTask = await DB.taskManager.findOneAndUpdate(filter, req.body, { new: true });

            if (!updateTask) {
                return response.NOT_FOUND({ res });
            }

            return response.OK({ res, payload: { updateTask } });
        } catch (error) {
            console.error("Error updating task: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete Task Manager API */
    deleteTask: async (req, res) => {
        try {
            // Find for the task and delete it
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, user_id: req.user.id };
            const deleteTask = await DB.taskManager.findOneAndDelete(filter);

            if (!deleteTask) {
                return response.NOT_FOUND({ res });
            }

            return response.OK({ res, payload: { deleteTask } });
        } catch (error) {
            console.error("Error deleting task: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
