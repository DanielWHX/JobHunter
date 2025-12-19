/**
 * DynamoDB Table Definitions for JobHunter
 *
 * Tables:
 * 1. PanicLogs - Time-series data for panic/anxiety moments
 * 2. DailyMetrics - Daily aggregated metrics (LeetCode, applications, hours)
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  CreateTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';

// DynamoDB client configuration
export const getDynamoDBClient = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(isDevelopment && {
      endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8001',
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      },
    }),
  });
};

/**
 * PanicLogs Table
 *
 * Stores anxiety/panic moments with categorization and action items
 *
 * PK: userId
 * SK: timestamp (ISO format)
 */
export const PanicLogsTableSchema = {
  TableName: 'JobHunter-PanicLogs',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' },  // Partition key
    { AttributeName: 'timestamp', KeyType: 'RANGE' }, // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'timestamp', AttributeType: 'S' },
    { AttributeName: 'date', AttributeType: 'S' }, // For GSI
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'DateIndex',
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'date', KeyType: 'RANGE' },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
  BillingMode: 'PAY_PER_REQUEST', // On-demand pricing
};

/**
 * DailyMetrics Table
 *
 * Stores daily aggregated metrics for dashboard visualization
 *
 * PK: userId
 * SK: date (YYYY-MM-DD)
 */
export const DailyMetricsTableSchema = {
  TableName: 'JobHunter-DailyMetrics',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' },
    { AttributeName: 'date', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' },
    { AttributeName: 'date', AttributeType: 'S' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

/**
 * Sample Data Structures
 */

export interface PanicLog {
  userId: string;
  timestamp: string; // ISO timestamp
  date: string; // YYYY-MM-DD
  trigger: string; // What caused the panic
  category: 'controllable' | 'uncontrollable';
  intensity: number; // 1-10 scale
  thoughts: string; // Free-form text
  actionItems: string[]; // Converted to actionable tasks
  resolved: boolean;
  tags: string[]; // e.g., ['job-search', 'leetcode', 'interview']
}

export interface DailyMetrics {
  userId: string;
  date: string; // YYYY-MM-DD
  leetcodeProblems: {
    solved: number;
    target: number;
    easy: number;
    medium: number;
    hard: number;
  };
  applications: {
    sent: number;
    target: number;
    highQuality: number; //精投
    massApply: number; // 海投
  };
  projectHours: {
    worked: number;
    target: number;
    tasks: string[];
  };
  githubCommits: number;
  dailyReviewCompleted: boolean;
  dailyReviewAnswers?: {
    solvedAlgorithm: boolean;
    sentApplications: boolean;
    learnedNewConcept: boolean;
    notes?: string;
  };
  streakDay: number;
  panicCount: number; // Number of panic logs for the day
}

/**
 * Initialize DynamoDB tables
 */
export const initializeTables = async () => {
  const client = getDynamoDBClient();

  const tables = [
    PanicLogsTableSchema,
    DailyMetricsTableSchema,
  ];

  for (const tableSchema of tables) {
    try {
      // Check if table exists
      await client.send(
        new DescribeTableCommand({ TableName: tableSchema.TableName })
      );
      console.log(`Table ${tableSchema.TableName} already exists`);
    } catch (error: any) {
      if (error.name === 'ResourceNotFoundException') {
        // Create table
        console.log(`Creating table ${tableSchema.TableName}...`);
        await client.send(new CreateTableCommand(tableSchema));
        console.log(`Table ${tableSchema.TableName} created successfully`);
      } else {
        console.error(`Error checking table ${tableSchema.TableName}:`, error);
        throw error;
      }
    }
  }
};

// Script to run initialization
if (require.main === module) {
  initializeTables()
    .then(() => {
      console.log('All tables initialized successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to initialize tables:', error);
      process.exit(1);
    });
}
