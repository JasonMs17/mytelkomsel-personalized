import { NextResponse } from "next/server";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

export const runtime = "nodejs";

export async function GET() {
  // Matikan debug di production / build environment Amplify
  const disabled =
    process.env.NODE_ENV === "production" ||
    process.env.DISABLE_DEBUG === "true";

  if (disabled) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const region = process.env.AWS_REGION || "ap-southeast-1";
  const client = new DynamoDBClient({ region });

  const res = await client.send(new ListTablesCommand({}));
  return NextResponse.json({
    region,
    tables: res.TableNames ?? [],
  });
}
