Serverless CRUD API with AWS CDK
This project implements a serverless CRUD API for task management using AWS CDK, Lambda, DynamoDB, and API Gateway.
Prerequisites

Node.js (v18.20.05)
AWS CLI configured with appropriate credentials
AWS CDK CLI installed (npm install -g aws-cdk)

A) Setup Instructions

1. Clone the repository:
git clone https://github.com/kavitha-555/Serverless-Crud-Api.git
cd serverless-crud-api-tasks
2. Install project dependencies:
npm install
3. Initialize npm and install dependencies
npm init -y
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
4.Deploy the CDK stack:
cdk deploy
The deployment will output your API Gateway endpoint URL.
B) API Testing
Using curl

1.Create a task:
curl -X POST -H "Content-Type: application/json" -d '{"title": "Test Task", "description": "Testing my API"}' https://he3rm6e419.execute-api.us-east-1.amazonaws.com/prod/tasks

2.Get a task:

curl https://https://he3rm6e419.execute-api.us-east-1.amazonaws.com/prod/tasks/{taskId}

3.Update a task:

curl -X PUT \
-H "Content-Type: application/json" \
-d '{"title": "Updated Task", "description": "Updated description"}' \
https://https://he3rm6e419.execute-api.us-east-1.amazonaws.com/prod/tasks/{taskId}

4.Delete a task:

curl -X DELETE https://https://he3rm6e419.execute-api.us-east-1.amazonaws.com/prod/tasks/{taskId}
