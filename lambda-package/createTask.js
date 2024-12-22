const { createTask } = require('./tasks');

exports.handler = async (event) => {
    try {
        const taskDetails = JSON.parse(event.body);
        return await createTask(taskDetails);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                message: "Invalid request",
                error: error.message
            })
        };
    }
};
