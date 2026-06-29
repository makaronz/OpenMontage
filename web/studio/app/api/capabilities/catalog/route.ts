export async function GET() {
  return Response.json({
    status: "ready",
    catalog: {
      image_generation: [
        { tool: "flux-image", provider: "FAL", configured: true },
        { tool: "dalle-image", provider: "OpenAI", configured: true },
        { tool: "grok-image", provider: "xAI", configured: true },
        { tool: "imagen-image", provider: "Google", configured: true },
        { tool: "heygen-video-gen", provider: "HeyGen", configured: true },
      ],
      video_generation: [
        { tool: "runway-gen4", provider: "Runway", configured: true },
        { tool: "heygen-video", provider: "HeyGen", configured: true },
      ],
    },
  });
}