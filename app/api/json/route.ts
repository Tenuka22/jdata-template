import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { ZodTypeAny, z } from "zod";

export const EXAMPLE_PROMPT = `DATA: \n"John is 25 years old and studies computer science at university"\n\n-----------\nExpected JSON format: 
{
  name: { type: "string" },
  age: { type: "number" },
  isStudent: { type: "boolean" },
  courses: {
    type: "array",
    items: { type: "string" },
  },
}
\n\n-----------\nValid JSON output in expected format:`;

export const EXAMPLE_ANSWER = `{
name: "John",
age: 25,
isStudent: true,
courses: ["computer science"],
}`;

const determineSchemaType = (schema: any): string => {
  if (!schema.hasOwnProperty("type")) {
    if (Array.isArray(schema)) {
      return "array";
    } else {
      return typeof schema;
    }
  }
  return schema.type;
};

const jsonSchemaToZod = (schema: any): ZodTypeAny => {
  const type = determineSchemaType(schema);

  switch (type) {
    case "string":
      return z.string().nullable();
    case "number":
      return z.number().nullable();
    case "boolean":
      return z.boolean().nullable();
    case "array":
      return z.array(jsonSchemaToZod(schema.items)).nullable();
    case "object":
      const shape: Record<string, ZodTypeAny> = {};
      for (const key in schema) {
        if (key !== "type") {
          shape[key] = jsonSchemaToZod(schema[key]);
        }
      }
      return z.object(shape).nullable();
    default:
      throw new Error(`Unsupported schema type: ${type}`);
  }
};

type PromiseExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void;

class RetryablePromise<T> extends Promise<T> {
  static async retry<T>(
    retries: number,
    executor: PromiseExecutor<T>
  ): Promise<T> {
    return new RetryablePromise<T>(executor).catch((error) => {
      console.error(`Retrying due to error: ${error}`);
      return retries > 0
        ? RetryablePromise.retry(retries - 1, executor)
        : RetryablePromise.reject(error);
    });
  }
}

const genericSchema = z.object({
  data: z.string(),
  format: z.object({}).passthrough(),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await JSON.parse(await req.text());

    if (!process.env.GEMINI_API_KEY) {
      console.error("No AI API KEY Found");
      return NextResponse.json(
        { error: "API key is missing" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { data, format } = genericSchema.parse(body);

    const dynamicSchema = jsonSchemaToZod(format);

    const prompt = `You are an AI that converts unstructured data into the attached JSON format. You respond with nothing but valid JSON based on the input data. Your output should DIRECTLY be valid JSON, nothing added before or after. You will begin right with the opening curly brace and end with the closing curly brace. Only if you absolutely cannot determine a field, use the value null. Only return the code snippet. Example code: ${EXAMPLE_PROMPT}, example answer: ${EXAMPLE_ANSWER}. This is the code: ${JSON.stringify(
      data
    )} and this is the format ${JSON.stringify(format)}`;

    const validationResult = await RetryablePromise.retry<string>(
      3,
      async (resolve, reject) => {
        try {
          const result = await aiModel.generateContent(prompt);
          const response = await result.response;
          const text = await response.text();

          if (!text) {
            throw new Error("AI model returned an empty response");
          }

          const jsonResponse = JSON.parse(text);
          const validationResult = dynamicSchema.parse(jsonResponse);

          resolve(validationResult);
        } catch (err) {
          reject(err);
        }
      }
    );

    return NextResponse.json(validationResult, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
