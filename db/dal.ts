import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { AppError } from "../lib/error";

let client: DynamoDBClient;

if (process.env.NODE_ENV === "development") {
  client = new DynamoDBClient({
    region: "eu-north-1",
    //endpoint: "http://localhost:8000", // -- set only for local development
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
} else if (process.env.NODE_ENV === "production") {
  client = new DynamoDBClient({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
} else {
  throw new AppError("Invalid NODE_ENV", 500, "Invalid NODE_ENV", true);
}

export const dynamoDB = DynamoDBDocumentClient.from(client);

export const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
