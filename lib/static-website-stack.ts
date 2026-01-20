import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export interface StaticWebsiteStackProps extends cdk.StackProps {
  bucketName: string;
  distributionId: string;
}

export class StaticWebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticWebsiteStackProps) {
    super(scope, id, props);

    // Import existing S3 bucket
    const bucket = s3.Bucket.fromBucketName(
      this,
      'ExistingBucket',
      props.bucketName
    );

    // Import existing CloudFront distribution
    const distribution = cloudfront.Distribution.fromDistributionAttributes(
      this,
      'ExistingDistribution',
      {
        distributionId: props.distributionId,
        domainName: `${props.distributionId}.cloudfront.net`,
      }
    );

    // Deploy website files to S3 and invalidate CloudFront cache
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', 'website'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output the bucket name and distribution ID for reference
    new cdk.CfnOutput(this, 'BucketName', {
      value: props.bucketName,
      description: 'S3 Bucket Name',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: props.distributionId,
      description: 'CloudFront Distribution ID',
    });
  }
}
