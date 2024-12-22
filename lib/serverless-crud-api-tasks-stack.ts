import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ServerlessCrudApiTasksStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB Table
    const tasksTable = new dynamodb.Table(this, 'TasksTable', {
      partitionKey: { name: 'taskId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      tableName: 'TasksTable',
    });

    // Create Lambda Functions
    const createTaskLambda = new lambda.Function(this, 'CreateTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'createTask.handler',
      environment: {
        TABLE_NAME: tasksTable.tableName,
      },
    });

    const getTaskLambda = new lambda.Function(this, 'GetTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getTask.handler',
      environment: {
        TABLE_NAME: tasksTable.tableName,
      },
    });

    const updateTaskLambda = new lambda.Function(this, 'UpdateTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'updateTask.handler',
      environment: {
        TABLE_NAME: tasksTable.tableName,
      },
    });

    const deleteTaskLambda = new lambda.Function(this, 'DeleteTaskFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'deleteTask.handler',
      environment: {
        TABLE_NAME: tasksTable.tableName,
      },
    });

    // Grant DynamoDB permissions to Lambda functions
    tasksTable.grantReadWriteData(createTaskLambda);
    tasksTable.grantReadWriteData(getTaskLambda);
    tasksTable.grantReadWriteData(updateTaskLambda);
    tasksTable.grantReadWriteData(deleteTaskLambda);

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'TasksApi', {
      restApiName: 'Tasks Service',
      description: 'This service handles CRUD operations for tasks.',
    });

    // API Gateway Integration
    const tasks = api.root.addResource('tasks');
    tasks.addMethod('POST', new apigateway.LambdaIntegration(createTaskLambda));
    const task = tasks.addResource('{taskId}');
    task.addMethod('GET', new apigateway.LambdaIntegration(getTaskLambda));
    task.addMethod('PUT', new apigateway.LambdaIntegration(updateTaskLambda));
    task.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTaskLambda));
  }
}

