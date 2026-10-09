import type { Creator } from '@/types';

export const mockCreators: Creator[] = [
  {
    "id": "creator-1",
    "name": "Mira Veln",
    "handle": "@veln.light",
    "avatarUrl": "https://picsum.photos/seed/avatar-1/200/200",
    "headline": "Product Ads creator",
    "bio": "I craft original image work with documented workflows and clear revision plans.",
    "experienceLevel": "Pro",
    "toolsUsed": [
      "Midjourney",
      "Flux.1"
    ],
    "skills": [
      "Product Photography",
      "Brand Styling"
    ],
    "specializations": [
      "Product Ads",
      "Fashion & Lifestyle"
    ],
    "contentTypes": [
      "image"
    ],
    "hourlyRate": 75,
    "turnaroundDays": 3,
    "rating": 4.9,
    "completedProjects": 64,
    "verification": {
      "toolsVerified": true,
      "workflowVerified": true,
      "pastWorkVerified": true
    },
    "featuredWork": [
      {
        "id": "work-1-1",
        "title": "Prism Product Ads Study",
        "description": "Original fictional portfolio concept demonstrating product photography.",
        "mediaType": "image",
        "mediaUrl": "https://picsum.photos/seed/snakalp-veln-prism/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "Midjourney",
          "Flux.1"
        ],
        "workflow": {
          "modelCheckpoint": "FLUX.1-dev",
          "seed": 420001,
          "sampler": "DPM++ 2M Karras",
          "steps": 28,
          "cfgScale": 5,
          "promptSnippet": "Product Ads concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      },
      {
        "id": "work-1-2",
        "title": "Dusk Product Ads Study",
        "description": "Original fictional portfolio concept demonstrating product photography.",
        "mediaType": "image",
        "mediaUrl": "https://picsum.photos/seed/snakalp-veln-dusk/640/800",
        "aspectRatio": "4:5",
        "toolsUsed": [
          "Midjourney",
          "Flux.1"
        ],
        "workflow": {
          "modelCheckpoint": "FLUX.1-dev",
          "seed": 420020,
          "sampler": "DPM++ 2M Karras",
          "steps": 28,
          "cfgScale": 5,
          "promptSnippet": "Product Ads concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      }
    ]
  },
  {
    "id": "creator-2",
    "name": "Orin Tave",
    "handle": "@tave.frames",
    "avatarUrl": "https://picsum.photos/seed/avatar-2/200/200",
    "headline": "Character Design creator",
    "bio": "I craft original image and prompt-pack work with documented workflows and clear revision plans.",
    "experienceLevel": "Studio",
    "toolsUsed": [
      "ComfyUI",
      "Stable Diffusion",
      "ControlNet"
    ],
    "skills": [
      "Character Consistency",
      "Prompt Engineering"
    ],
    "specializations": [
      "Character Design"
    ],
    "contentTypes": [
      "image",
      "prompt-pack"
    ],
    "hourlyRate": 120,
    "turnaroundDays": 4,
    "rating": 5,
    "completedProjects": 92,
    "verification": {
      "toolsVerified": true,
      "workflowVerified": true,
      "pastWorkVerified": true
    },
    "featuredWork": [
      {
        "id": "work-2-1",
        "title": "Prism Character Design Study",
        "description": "Original fictional portfolio concept demonstrating character consistency.",
        "mediaType": "image",
        "mediaUrl": "https://picsum.photos/seed/snakalp-tave-prism/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "ComfyUI",
          "Stable Diffusion",
          "ControlNet"
        ],
        "workflow": {
          "modelCheckpoint": "SDXL 1.0 Base",
          "seed": 420114,
          "sampler": "DPM++ 2M Karras",
          "steps": 29,
          "cfgScale": 6,
          "promptSnippet": "Character Design concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "own-trained"
      },
      {
        "id": "work-2-2",
        "title": "Dusk Character Design Study",
        "description": "Original fictional portfolio concept demonstrating character consistency.",
        "mediaType": "prompt-pack",
        "mediaUrl": "https://picsum.photos/seed/snakalp-tave-dusk/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "ComfyUI",
          "Stable Diffusion",
          "ControlNet"
        ],
        "workflow": {
          "modelCheckpoint": "SDXL 1.0 Base",
          "seed": 420133,
          "sampler": "DPM++ 2M Karras",
          "steps": 29,
          "cfgScale": 6,
          "promptSnippet": "Character Design concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "own-trained"
      }
    ]
  },
  {
    "id": "creator-3",
    "name": "Luma Sern",
    "handle": "@sern.motion",
    "avatarUrl": "https://picsum.photos/seed/avatar-3/200/200",
    "headline": "Film & Storytelling creator",
    "bio": "I craft original video work with documented workflows and clear revision plans.",
    "experienceLevel": "Pro",
    "toolsUsed": [
      "Runway Gen-3",
      "Pika Labs"
    ],
    "skills": [
      "Motion Design",
      "Storyboarding"
    ],
    "specializations": [
      "Film & Storytelling",
      "Social Media Content"
    ],
    "contentTypes": [
      "video"
    ],
    "hourlyRate": 95,
    "turnaroundDays": 5,
    "rating": 4.8,
    "completedProjects": 51,
    "verification": {
      "toolsVerified": true,
      "workflowVerified": true,
      "pastWorkVerified": true
    },
    "featuredWork": [
      {
        "id": "work-3-1",
        "title": "Prism Film & Storytelling Study",
        "description": "Original fictional portfolio concept demonstrating motion design.",
        "mediaType": "video",
        "mediaUrl": "https://picsum.photos/seed/snakalp-sern-prism/960/540",
        "aspectRatio": "16:9",
        "toolsUsed": [
          "Runway Gen-3",
          "Pika Labs"
        ],
        "workflow": {
          "modelCheckpoint": "Runway Gen-3 Alpha",
          "seed": 420227,
          "sampler": "DPM++ 2M Karras",
          "steps": 30,
          "cfgScale": 7,
          "promptSnippet": "Film & Storytelling concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      },
      {
        "id": "work-3-2",
        "title": "Dusk Film & Storytelling Study",
        "description": "Original fictional portfolio concept demonstrating motion design.",
        "mediaType": "video",
        "mediaUrl": "https://picsum.photos/seed/snakalp-sern-dusk/960/540",
        "aspectRatio": "16:9",
        "toolsUsed": [
          "Runway Gen-3",
          "Pika Labs"
        ],
        "workflow": {
          "modelCheckpoint": "Runway Gen-3 Alpha",
          "seed": 420246,
          "sampler": "DPM++ 2M Karras",
          "steps": 30,
          "cfgScale": 7,
          "promptSnippet": "Film & Storytelling concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      }
    ]
  },
  {
    "id": "creator-4",
    "name": "Daro Fenn",
    "handle": "@fenn.reels",
    "avatarUrl": "https://picsum.photos/seed/avatar-4/200/200",
    "headline": "Social Media Content creator",
    "bio": "I craft original video work with documented workflows and clear revision plans.",
    "experienceLevel": "Intermediate",
    "toolsUsed": [
      "Pika Labs",
      "ChatGPT"
    ],
    "skills": [
      "Lip Sync",
      "Storyboarding"
    ],
    "specializations": [
      "Social Media Content"
    ],
    "contentTypes": [
      "video"
    ],
    "hourlyRate": 55,
    "turnaroundDays": 6,
    "rating": 4.5,
    "completedProjects": 28,
    "verification": {
      "toolsVerified": true,
      "workflowVerified": false,
      "pastWorkVerified": true
    },
    "featuredWork": [
      {
        "id": "work-4-1",
        "title": "Prism Social Media Content Study",
        "description": "Original fictional portfolio concept demonstrating lip sync.",
        "mediaType": "video",
        "mediaUrl": "https://picsum.photos/seed/snakalp-fenn-prism/960/540",
        "aspectRatio": "16:9",
        "toolsUsed": [
          "Pika Labs",
          "ChatGPT"
        ],
        "workflow": {
          "modelCheckpoint": "Pika 2.2",
          "seed": 420340,
          "sampler": "DPM++ 2M Karras",
          "steps": 31,
          "cfgScale": 8,
          "promptSnippet": "Social Media Content concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      },
      {
        "id": "work-4-2",
        "title": "Dusk Social Media Content Study",
        "description": "Original fictional portfolio concept demonstrating lip sync.",
        "mediaType": "video",
        "mediaUrl": "https://picsum.photos/seed/snakalp-fenn-dusk/960/540",
        "aspectRatio": "16:9",
        "toolsUsed": [
          "Pika Labs",
          "ChatGPT"
        ],
        "workflow": {
          "modelCheckpoint": "Pika 2.2",
          "seed": 420359,
          "sampler": "DPM++ 2M Karras",
          "steps": 31,
          "cfgScale": 8,
          "promptSnippet": "Social Media Content concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      }
    ]
  },
  {
    "id": "creator-5",
    "name": "Neri Quill",
    "handle": "@quill.loops",
    "avatarUrl": "https://picsum.photos/seed/avatar-5/200/200",
    "headline": "Animation & Motion creator",
    "bio": "I craft original animation work with documented workflows and clear revision plans.",
    "experienceLevel": "Intermediate",
    "toolsUsed": [
      "AnimateDiff",
      "ComfyUI",
      "ControlNet"
    ],
    "skills": [
      "Motion Design",
      "Character Consistency"
    ],
    "specializations": [
      "Animation & Motion"
    ],
    "contentTypes": [
      "animation"
    ],
    "hourlyRate": 65,
    "turnaroundDays": 7,
    "rating": 4.6,
    "completedProjects": 35,
    "verification": {
      "toolsVerified": true,
      "workflowVerified": true,
      "pastWorkVerified": false
    },
    "featuredWork": [
      {
        "id": "work-5-1",
        "title": "Prism Animation & Motion Study",
        "description": "Original fictional portfolio concept demonstrating motion design.",
        "mediaType": "animation",
        "mediaUrl": "https://picsum.photos/seed/snakalp-quill-prism/540/960",
        "aspectRatio": "9:16",
        "toolsUsed": [
          "AnimateDiff",
          "ComfyUI",
          "ControlNet"
        ],
        "workflow": {
          "modelCheckpoint": "AnimateDiff SDXL Motion",
          "seed": 420453,
          "sampler": "DPM++ 2M Karras",
          "steps": 32,
          "cfgScale": 5,
          "promptSnippet": "Animation & Motion concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "open-source"
      },
      {
        "id": "work-5-2",
        "title": "Dusk Animation & Motion Study",
        "description": "Original fictional portfolio concept demonstrating motion design.",
        "mediaType": "animation",
        "mediaUrl": "https://picsum.photos/seed/snakalp-quill-dusk/540/960",
        "aspectRatio": "9:16",
        "toolsUsed": [
          "AnimateDiff",
          "ComfyUI",
          "ControlNet"
        ],
        "workflow": {
          "modelCheckpoint": "AnimateDiff SDXL Motion",
          "seed": 420472,
          "sampler": "DPM++ 2M Karras",
          "steps": 32,
          "cfgScale": 5,
          "promptSnippet": "Animation & Motion concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "open-source"
      }
    ]
  },
  {
    "id": "creator-6",
    "name": "Sela Voss",
    "handle": "@voss.sound",
    "avatarUrl": "https://picsum.photos/seed/avatar-6/200/200",
    "headline": "Music & Voice creator",
    "bio": "I craft original audio work with documented workflows and clear revision plans.",
    "experienceLevel": "Pro",
    "toolsUsed": [
      "Suno"
    ],
    "skills": [
      "Music Composition"
    ],
    "specializations": [
      "Music & Voice"
    ],
    "contentTypes": [
      "audio"
    ],
    "hourlyRate": 85,
    "turnaroundDays": 8,
    "rating": 4.7,
    "completedProjects": 43,
    "verification": {
      "toolsVerified": false,
      "workflowVerified": true,
      "pastWorkVerified": false
    },
    "featuredWork": [
      {
        "id": "work-6-1",
        "title": "Prism Music & Voice Study",
        "description": "Original fictional portfolio concept demonstrating music composition.",
        "mediaType": "audio",
        "mediaUrl": "https://picsum.photos/seed/snakalp-voss-prism/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "Suno"
        ],
        "workflow": {
          "modelCheckpoint": "Suno v4",
          "seed": 420566,
          "sampler": "DPM++ 2M Karras",
          "steps": 33,
          "cfgScale": 6,
          "promptSnippet": "Music & Voice concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      },
      {
        "id": "work-6-2",
        "title": "Dusk Music & Voice Study",
        "description": "Original fictional portfolio concept demonstrating music composition.",
        "mediaType": "audio",
        "mediaUrl": "https://picsum.photos/seed/snakalp-voss-dusk/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "Suno"
        ],
        "workflow": {
          "modelCheckpoint": "Suno v4",
          "seed": 420585,
          "sampler": "DPM++ 2M Karras",
          "steps": 33,
          "cfgScale": 6,
          "promptSnippet": "Music & Voice concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      }
    ]
  },
  {
    "id": "creator-7",
    "name": "Tovin Rell",
    "handle": "@rell.voice",
    "avatarUrl": "https://picsum.photos/seed/avatar-7/200/200",
    "headline": "Music & Voice creator",
    "bio": "I craft original audio work with documented workflows and clear revision plans.",
    "experienceLevel": "Beginner",
    "toolsUsed": [
      "ElevenLabs",
      "Claude 3.5"
    ],
    "skills": [
      "Voice Cloning",
      "Prompt Engineering"
    ],
    "specializations": [
      "Music & Voice"
    ],
    "contentTypes": [
      "audio"
    ],
    "hourlyRate": 25,
    "turnaroundDays": 9,
    "rating": 3.8,
    "completedProjects": 8,
    "verification": {
      "toolsVerified": false,
      "workflowVerified": false,
      "pastWorkVerified": false
    },
    "featuredWork": [
      {
        "id": "work-7-1",
        "title": "Prism Music & Voice Study",
        "description": "Original fictional portfolio concept demonstrating voice cloning.",
        "mediaType": "audio",
        "mediaUrl": "https://picsum.photos/seed/snakalp-rell-prism/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "ElevenLabs",
          "Claude 3.5"
        ],
        "workflow": {
          "modelCheckpoint": "Eleven Multilingual v2",
          "seed": 420679,
          "sampler": "DPM++ 2M Karras",
          "steps": 34,
          "cfgScale": 7,
          "promptSnippet": "Music & Voice concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": false
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      },
      {
        "id": "work-7-2",
        "title": "Dusk Music & Voice Study",
        "description": "Original fictional portfolio concept demonstrating voice cloning.",
        "mediaType": "audio",
        "mediaUrl": "https://picsum.photos/seed/snakalp-rell-dusk/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "ElevenLabs",
          "Claude 3.5"
        ],
        "workflow": {
          "modelCheckpoint": "Eleven Multilingual v2",
          "seed": 420698,
          "sampler": "DPM++ 2M Karras",
          "steps": 34,
          "cfgScale": 7,
          "promptSnippet": "Music & Voice concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": false
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      }
    ]
  },
  {
    "id": "creator-8",
    "name": "Aven Pell",
    "handle": "@pell.visuals",
    "avatarUrl": "https://picsum.photos/seed/avatar-8/200/200",
    "headline": "Fashion & Lifestyle creator",
    "bio": "I craft original image work with documented workflows and clear revision plans.",
    "experienceLevel": "Beginner",
    "toolsUsed": [
      "Stable Diffusion",
      "Midjourney"
    ],
    "skills": [
      "Upscaling & Retouching",
      "Brand Styling"
    ],
    "specializations": [
      "Fashion & Lifestyle"
    ],
    "contentTypes": [
      "image"
    ],
    "hourlyRate": 40,
    "turnaroundDays": 10,
    "rating": 4.1,
    "completedProjects": 15,
    "verification": {
      "toolsVerified": false,
      "workflowVerified": false,
      "pastWorkVerified": false
    },
    "featuredWork": [
      {
        "id": "work-8-1",
        "title": "Prism Fashion & Lifestyle Study",
        "description": "Original fictional portfolio concept demonstrating upscaling & retouching.",
        "mediaType": "image",
        "mediaUrl": "https://picsum.photos/seed/snakalp-pell-prism/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "Stable Diffusion",
          "Midjourney"
        ],
        "workflow": {
          "modelCheckpoint": "SDXL 1.0 Base",
          "seed": 420792,
          "sampler": "DPM++ 2M Karras",
          "steps": 35,
          "cfgScale": 8,
          "promptSnippet": "Fashion & Lifestyle concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": true,
        "licenseType": "commercial-safe"
      },
      {
        "id": "work-8-2",
        "title": "Dusk Fashion & Lifestyle Study",
        "description": "Original fictional portfolio concept demonstrating upscaling & retouching.",
        "mediaType": "image",
        "mediaUrl": "https://picsum.photos/seed/snakalp-pell-dusk/640/640",
        "aspectRatio": "1:1",
        "toolsUsed": [
          "Stable Diffusion",
          "Midjourney"
        ],
        "workflow": {
          "modelCheckpoint": "SDXL 1.0 Base",
          "seed": 420811,
          "sampler": "DPM++ 2M Karras",
          "steps": 35,
          "cfgScale": 8,
          "promptSnippet": "Fashion & Lifestyle concept, balanced composition, soft studio lighting, refined detail",
          "negativePromptSnippet": "artifacts, distortion, blurry detail",
          "revisionReady": true
        },
        "commercialLicensed": false,
        "licenseType": "non-commercial"
      }
    ]
  }
];

export function getCreatorById(id: string): Creator | undefined {
  return mockCreators.find(creator => creator.id === id);
}
