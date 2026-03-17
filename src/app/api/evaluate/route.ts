import { NextRequest, NextResponse } from "next/server";
import { evaluateLocally } from "@/lib/evaluator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, output } = body as { input: string; output: string };

    if (!input || !output) {
      return NextResponse.json(
        { error: "Both input and output are required" },
        { status: 400 }
      );
    }

    const evaluation = evaluateLocally(input, output);

    return NextResponse.json(evaluation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
