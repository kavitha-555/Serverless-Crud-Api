const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Create Task
async function createTask(taskDetails) {
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: `task_${timestamp}`,
            title: taskDetails.title,
            description: taskDetails.description,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    };

    try {
        await docClient.send(new PutCommand(params));
        return {
            statusCode: 201,
            body: JSON.stringify({
                success: true,
                message: "Task created successfully",
                task: params.Item
            })
        };
    } catch (error) {
        console.error("Error creating task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Error creating task",
                error: error.message
            })
        };
    }
}

// Delete Task
async function deleteTask(taskId) {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: { id: taskId }
    };

    try {
        await docClient.send(new DeleteCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Task deleted successfully",
                taskId: taskId
            })
        };
    } catch (error) {
        console.error("Error deleting task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Error deleting task",
                error: error.message
            })
        };
    }
}

// Get Task
async function getTask(taskId) {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: { id: taskId }
    };

    try {
        const { Item } = await docClient.send(new GetCommand(params));
        if (!Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    success: false,
                    message: "Task not found"
                })
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                task: Item
            })
        };
    } catch (error) {
        console.error("Error getting task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Error getting task",
                error: error.message
            })
        };
    }
}

// Update Task
async function updateTask(taskId, updatedDetails) {
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: { id: taskId },
        UpdateExpression: "set title = :title, description = :description, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":title": updatedDetails.title,
            ":description": updatedDetails.description,
            ":updatedAt": timestamp
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const { Attributes } = await docClient.send(new UpdateCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Task updated successfully",
                task: Attributes
            })
        };
    } catch (error) {
        console.error("Error updating task:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Error updating task",
                error: error.message
            })
        };
    }
}

module.exports = {
    createTask,
    deleteTask,
    getTask,
    updateTask
};
