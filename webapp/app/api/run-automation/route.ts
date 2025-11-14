import { runAutomation } from "@/lib/automation";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Automation endpoint. Send a POST request to trigger the upload.",
      requiredEnv: [
        "PEXELS_API_KEY",
        "IG_USER_ID",
        "IG_ACCESS_TOKEN",
        "DEFAULT_CAPTION_TEMPLATE (optional)",
        "GRAPH_API_VERSION (optional)",
      ],
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

export async function POST() {
  try {
    const result = await runAutomation();

    return new Response(
      JSON.stringify({
        success: true,
        result,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Automation failed", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ success: false, message }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
