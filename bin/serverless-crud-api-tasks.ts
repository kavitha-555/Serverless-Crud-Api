#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ServerlessCrudApiTasksStack } from '../lib/serverless-crud-api-tasks-stack';

const app = new cdk.App();
new ServerlessCrudApiTasksStack(app, 'ServerlessCrudApiTasksStack', {
  env: {
    region: 'us-east-1', // Change to your desired AWS region
  },
});

