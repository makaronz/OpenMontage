export type SetupField = {
  envKey: string;
  hint?: string;
};

export type SetupProviderCard = {
  id: string;
  title: string;
  description: string;
  fields: SetupField[];
  primaryLink: { label: string; href: string };
  secondaryLinks?: Array<{ label: string; href: string }>;
  note?: string;
  optional?: boolean;
};

export const PRIMARY_ENV_KEYS = [
  "FAL_KEY",
  "GOOGLE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "ELEVENLABS_API_KEY",
  "XAI_API_KEY",
  "DOUBAO_SPEECH_API_KEY",
  "DOUBAO_SPEECH_VOICE_TYPE",
  "SUNO_API_KEY",
  "HEYGEN_API_KEY",
  "RUNWAY_API_KEY",
  "MODAL_LTX2_ENDPOINT_URL",
  "PEXELS_API_KEY",
  "PIXABAY_API_KEY",
  "UNSPLASH_ACCESS_KEY",
  "HF_TOKEN",
] as const;

export const OPTIONAL_ENV_KEYS = [
  "REPLICATE_API_TOKEN",
  "HIGGSFIELD_API_KEY",
  "HIGGSFIELD_API_SECRET",
  "FREESOUND_API_KEY",
] as const;

export const primaryProviderCards: SetupProviderCard[] = [
  {
    id: "fal",
    title: "fal.ai",
    description: "FLUX, Recraft, Kling, MiniMax, Seedance, Veo via FAL.",
    fields: [{ envKey: "FAL_KEY" }],
    primaryLink: {
      label: "Open fal.ai keys",
      href: "https://fal.ai/dashboard/keys",
    },
    note: "If a tool reports FAL_AI_API_KEY, paste that value as FAL_KEY in OpenMontage.",
  },
  {
    id: "google-gemini",
    title: "Google AI Studio / Gemini",
    description: "Imagen and Google TTS. OpenMontage reads GOOGLE_API_KEY or GEMINI_API_KEY.",
    fields: [
      { envKey: "GOOGLE_API_KEY" },
      { envKey: "GEMINI_API_KEY" },
    ],
    primaryLink: {
      label: "Open Google AI Studio",
      href: "https://aistudio.google.com/apikey",
    },
  },
  {
    id: "openai",
    title: "OpenAI",
    description: "OpenAI TTS and image generation.",
    fields: [{ envKey: "OPENAI_API_KEY" }],
    primaryLink: {
      label: "Open OpenAI API keys",
      href: "https://platform.openai.com/api-keys",
    },
  },
  {
    id: "elevenlabs",
    title: "ElevenLabs",
    description: "TTS, music generation, and sound effects.",
    fields: [{ envKey: "ELEVENLABS_API_KEY" }],
    primaryLink: {
      label: "Open ElevenLabs keys",
      href: "https://elevenlabs.io/app/settings/api-keys",
    },
  },
  {
    id: "xai",
    title: "xAI",
    description: "Grok image generation, editing, and video.",
    fields: [{ envKey: "XAI_API_KEY" }],
    primaryLink: {
      label: "Open xAI Console",
      href: "https://console.x.ai/",
    },
    secondaryLinks: [
      { label: "Docs", href: "https://docs.x.ai/developers/quickstart" },
    ],
    note: "The console shows the full key only once.",
  },
  {
    id: "doubao",
    title: "Doubao Speech / Volcengine",
    description: "Volcengine Doubao Speech TTS.",
    fields: [
      { envKey: "DOUBAO_SPEECH_API_KEY" },
      {
        envKey: "DOUBAO_SPEECH_VOICE_TYPE",
        hint: "Voice name, not a secret",
      },
    ],
    primaryLink: {
      label: "Open Volcengine Console",
      href: "https://console.volcengine.com/",
    },
    secondaryLinks: [
      {
        label: "Voice product",
        href: "https://www.volcengine.com/product/voice-tech",
      },
    ],
  },
  {
    id: "suno",
    title: "SunoAPI",
    description: "Music generation via Suno API gateway.",
    fields: [{ envKey: "SUNO_API_KEY" }],
    primaryLink: {
      label: "Open SunoAPI key",
      href: "https://sunoapi.org/api-key",
    },
    secondaryLinks: [{ label: "Docs", href: "https://docs.sunoapi.org/" }],
  },
  {
    id: "heygen",
    title: "HeyGen",
    description: "Video gateway: VEO, Sora, Runway, Kling, Seedance.",
    fields: [{ envKey: "HEYGEN_API_KEY" }],
    primaryLink: {
      label: "Open HeyGen API",
      href: "https://app.heygen.com/settings/api",
    },
    secondaryLinks: [{ label: "Docs", href: "https://docs.heygen.com/" }],
  },
  {
    id: "runway",
    title: "Runway",
    description: "Runway Gen-4 direct API.",
    fields: [{ envKey: "RUNWAY_API_KEY" }],
    primaryLink: {
      label: "Open Runway API",
      href: "https://dev.runwayml.com/",
    },
    secondaryLinks: [
      {
        label: "Setup guide",
        href: "https://docs.dev.runwayml.com/guides/setup/",
      },
    ],
  },
  {
    id: "modal-ltx",
    title: "Modal LTX endpoint",
    description: "Self-hosted LTX-2 endpoint on Modal.",
    fields: [{ envKey: "MODAL_LTX2_ENDPOINT_URL" }],
    primaryLink: {
      label: "Open Modal apps",
      href: "https://modal.com/apps",
    },
    secondaryLinks: [
      {
        label: "Endpoint docs",
        href: "https://frontend.modal.com/docs/guide/webhook-urls",
      },
    ],
  },
  {
    id: "pexels",
    title: "Pexels",
    description: "Free stock footage and images.",
    fields: [{ envKey: "PEXELS_API_KEY" }],
    primaryLink: {
      label: "Open Pexels API",
      href: "https://www.pexels.com/api/",
    },
  },
  {
    id: "pixabay",
    title: "Pixabay",
    description: "Free footage, images, and music search.",
    fields: [{ envKey: "PIXABAY_API_KEY" }],
    primaryLink: {
      label: "Open Pixabay API",
      href: "https://pixabay.com/api/docs/",
    },
  },
  {
    id: "unsplash",
    title: "Unsplash",
    description: "Free stock images.",
    fields: [{ envKey: "UNSPLASH_ACCESS_KEY" }],
    primaryLink: {
      label: "Open Unsplash apps",
      href: "https://unsplash.com/oauth/applications",
    },
    secondaryLinks: [
      { label: "Developer page", href: "https://unsplash.com/developers" },
    ],
  },
  {
    id: "huggingface",
    title: "Hugging Face",
    description: "Diarization and some ML paths.",
    fields: [{ envKey: "HF_TOKEN" }],
    primaryLink: {
      label: "Open HF tokens",
      href: "https://huggingface.co/settings/tokens",
    },
  },
];

export const optionalProviderCards: SetupProviderCard[] = [
  {
    id: "replicate",
    title: "Replicate Seedance",
    description: "Alternative Seedance path via Replicate.",
    fields: [{ envKey: "REPLICATE_API_TOKEN" }],
    primaryLink: {
      label: "Open Replicate tokens",
      href: "https://replicate.com/account/api-tokens",
    },
    optional: true,
  },
  {
    id: "higgsfield",
    title: "Higgsfield",
    description: "Cloud video provider (outside standard .env.example).",
    fields: [
      { envKey: "HIGGSFIELD_API_KEY" },
      { envKey: "HIGGSFIELD_API_SECRET" },
    ],
    primaryLink: {
      label: "Open Higgsfield API keys",
      href: "https://cloud.higgsfield.ai/api-keys",
    },
    optional: true,
  },
  {
    id: "freesound",
    title: "Freesound",
    description: "Alternative music and SFX search.",
    fields: [{ envKey: "FREESOUND_API_KEY" }],
    primaryLink: {
      label: "Open Freesound API",
      href: "https://freesound.org/apiv2/apply/",
    },
    optional: true,
  },
];
