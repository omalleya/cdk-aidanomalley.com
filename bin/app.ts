#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticWebsiteStack } from '../lib/static-website-stack';

const app = new cdk.App();

const bucketName = app.node.tryGetContext('bucketName');
const distributionId = app.node.tryGetContext('distributionId');

if (!bucketName) {
  throw new Error('Missing required context: bucketName. Use -c bucketName=YOUR_BUCKET');
}

if (!distributionId) {
  throw new Error('Missing required context: distributionId. Use -c distributionId=YOUR_DIST_ID');
}

new StaticWebsiteStack(app, 'StaticWebsiteStack', {
  bucketName,
  distributionId,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
