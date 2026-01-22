import { NextResponse } from "next/server";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

export const runtime = "nodejs";

export async function GET() {
  const region = process.env.AWS_REGION || "ap-southeast-1";
  const client = new DynamoDBClient({ region });

  const res = await client.send(new ListTablesCommand({}));
  return NextResponse.json({
    region,
    AWS_PROFILE: process.env.AWS_PROFILE || "default",
    tables: res.TableNames ?? [],
  });
}
