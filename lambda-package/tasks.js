const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Create Task
async function createTask(taskDetails) {
    const timestamp = new Date().getTime();
    const taskId = `task_${timestamp}`; // Generate a unique taskId

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            taskId: taskId,  // Primary key
            title: taskDetails.title,
            description: taskDetails.description,
            status: 'PENDING', // Adding a status field
            createdAt: timestamp.toString(),
            updatedAt: timestamp.toString()
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

module.exports = {
    createTask
};
