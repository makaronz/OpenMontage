export async function POST() {
  return Response.json({
    status: "ready", elapsed_ms: 3421, warmup_ms: 2840,
    summary: {
      composition_runtimes: { ffmpeg: true, remotion: true, hyperframes: false },
      capabilities: [
        { capability: "image_generation", configured: 5, total: 7, available_providers: ["FAL", "OpenAI", "xAI", "Google", "HeyGen"], unavailable_providers: ["Recraft", "Kling"] },
        { capability: "video_generation", configured: 2, total: 4, available_providers: ["Runway", "HeyGen"], unavailable_providers: ["Kling", "MiniMax"] },
        { capability: "text_to_speech", configured: 3, total: 3, available_providers: ["ElevenLabs", "OpenAI", "Google"], unavailable_providers: [] },
        { capability: "music_generation", configured: 2, total: 2, available_providers: ["ElevenLabs", "Suno"], unavailable_providers: [] },
        { capability: "stock_footage", configured: 3, total: 3, available_providers: ["Pexels", "Pixabay", "Unsplash"], unavailable_providers: [] },
        { capability: "speech_to_text", configured: 1, total: 1, available_providers: ["Hugging Face"], unavailable_providers: [] },
        { capability: "video_editing", configured: 0, total: 1, unavailable_providers: ["FFmpeg"] },
        { capability: "image_editing", configured: 3, total: 3, available_providers: ["OpenAI", "xAI", "FAL"], unavailable_providers: [] },
      ],
      setup_offers: [
        { capability: "video_generation", tool: "kling-video", provider: "Kling", install_instructions: "Set FAL_KEY (Kling routed via FAL)" },
        { capability: "video_generation", tool: "minimax-video", provider: "MiniMax", install_instructions: "Set FAL_KEY (MiniMax routed via FAL)" },
        { capability: "image_generation", tool: "recraft-image", provider: "Recraft", install_instructions: "Set FAL_KEY (Recraft routed via FAL)" },
        { capability: "image_generation", tool: "kling-image", provider: "Kling", install_instructions: "Set FAL_KEY (Kling routed via FAL)" },
        { capability: "video_editing", tool: "ffmpeg", provider: "FFmpeg", install_instructions: "Install FFmpeg locally via brew or apt" },
      ],
      runtime_warnings: ["HyperFrames runtime not detected --- install @openmontage/hyperframes"],
    },
  });
}