const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get Task Manager API */
    getTasks: async (req, res) => {
        try {
            // check if id is present in params
            const filter = req.params.id
                ? {
                      _id: req.params.id,
                      user_id: req.user.id,
                  }
                : {
                      ...req.query,
                      user_id: req.user.id,
                  };
                  
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
            const updateTask = await DB.taskManager.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user_id: req.user.id,
                },
                req.body,
                { new: true }
            );

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
            // find for the task and delete it
            const deleteTask = await DB.taskManager.findOneAndDelete({
                _id: req.params.id,
                user_id: req.user.id,
            });

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
