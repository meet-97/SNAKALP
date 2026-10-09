import type { ProjectBrief } from '@/types';

export const mockBriefs: ProjectBrief[] = [
  {
    "id": "brief-1",
    "brandName": "Prismvale",
    "title": "Product launch stills",
    "description": "Create minimal product visuals for a fictional desk accessory.",
    "deliverableType": "image",
    "styleTags": [
      "Photorealistic",
      "Minimal"
    ],
    "aspectRatio": "1:1",
    "requiredTools": [
      "Midjourney"
    ],
    "requiredSkills": [
      "Product Photography"
    ],
    "budgetMin": 200,
    "budgetMax": 800,
    "deadlineDays": 7,
    "commercialUse": {
      "required": true,
      "channels": [
        "Social Media"
      ],
      "durationMonths": 12,
      "territory": "India",
      "exclusive": false
    },
    "status": "open",
    "shortlistedCreatorIds": [],
    "createdAt": "2026-10-01T10:00:00.000Z"
  },
  {
    "id": "brief-2",
    "brandName": "Velora Grove",
    "title": "Vertical character reel",
    "description": "Create a consistent character in a short social reel.",
    "deliverableType": "video",
    "styleTags": [
      "Cinematic"
    ],
    "aspectRatio": "9:16",
    "requiredTools": [
      "Pika Labs"
    ],
    "requiredSkills": [
      "Character Consistency",
      "Storyboarding"
    ],
    "budgetMin": 300,
    "budgetMax": 950,
    "deadlineDays": 8,
    "commercialUse": {
      "required": true,
      "channels": [
        "Social Media"
      ],
      "durationMonths": 12,
      "territory": "India",
      "exclusive": false
    },
    "status": "shortlisted",
    "shortlistedCreatorIds": [
      "creator-4"
    ],
    "createdAt": "2026-10-02T10:00:00.000Z"
  },
  {
    "id": "brief-3",
    "brandName": "Lumen Finch",
    "title": "Animated launch loop",
    "description": "Animate a seamless branded loop with a documented workflow.",
    "deliverableType": "animation",
    "styleTags": [
      "Cinematic"
    ],
    "aspectRatio": "9:16",
    "requiredTools": [
      "AnimateDiff",
      "ComfyUI"
    ],
    "requiredSkills": [
      "Motion Design"
    ],
    "budgetMin": 400,
    "budgetMax": 1100,
    "deadlineDays": 9,
    "commercialUse": {
      "required": true,
      "channels": [
        "Social Media"
      ],
      "durationMonths": 12,
      "territory": "India",
      "exclusive": false
    },
    "status": "in_progress",
    "shortlistedCreatorIds": [
      "creator-5"
    ],
    "assignedCreatorId": "creator-5",
    "createdAt": "2026-10-03T10:00:00.000Z"
  },
  {
    "id": "brief-4",
    "brandName": "Echo Orchard",
    "title": "Brand jingle revision",
    "description": "Compose a warm original jingle for a fictional homeware launch.",
    "deliverableType": "audio",
    "styleTags": [
      "Cinematic"
    ],
    "aspectRatio": "1:1",
    "requiredTools": [
      "Suno"
    ],
    "requiredSkills": [
      "Music Composition"
    ],
    "budgetMin": 500,
    "budgetMax": 1250,
    "deadlineDays": 10,
    "commercialUse": {
      "required": true,
      "channels": [
        "Social Media"
      ],
      "durationMonths": 12,
      "territory": "India",
      "exclusive": true
    },
    "status": "revision",
    "shortlistedCreatorIds": [
      "creator-6"
    ],
    "assignedCreatorId": "creator-6",
    "createdAt": "2026-10-04T10:00:00.000Z"
  },
  {
    "id": "brief-5",
    "brandName": "Nimble Haze",
    "title": "Narrated website story",
    "description": "Record a clear narrated introduction for a fictional creative studio.",
    "deliverableType": "audio",
    "styleTags": [
      "Cinematic"
    ],
    "aspectRatio": "16:9",
    "requiredTools": [
      "ElevenLabs"
    ],
    "requiredSkills": [
      "Voice Cloning"
    ],
    "budgetMin": 600,
    "budgetMax": 1400,
    "deadlineDays": 11,
    "commercialUse": {
      "required": true,
      "channels": [
        "Website"
      ],
      "durationMonths": 12,
      "territory": "India",
      "exclusive": false
    },
    "status": "delivered",
    "shortlistedCreatorIds": [
      "creator-7"
    ],
    "assignedCreatorId": "creator-7",
    "createdAt": "2026-10-05T10:00:00.000Z"
  }
];
