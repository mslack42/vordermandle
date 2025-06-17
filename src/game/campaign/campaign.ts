import { GameProfile, Nonsense } from "../game-generation";

export type CampaignSet = {
  id: string;
  name: string;
  games: CampaignGame[];
  unlocksAt: number;
};

export type CampaignGame = {
  id: string;
  profile: GameProfile;
};

export type Campaign = {
  sets: CampaignSet[];
};

const Basic: CampaignSet = {
  id: "basic",
  name: "Beginning",
  unlocksAt: 0,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["bigNumber"],
        nonsenseCounts: 0,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["bigNumber"],
        nonsenseCounts: 0,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.8,
        legalNonsense: ["bigNumber"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.6,
        legalNonsense: ["bigNumber"],
        nonsenseCounts: 1,
        useExpertBigs: true,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.5,
        legalNonsense: ["bigNumber"],
        nonsenseCounts: 1,
        useExpertBigs: true,
      },
    },
  ],
};

const GettingWorse: CampaignSet = {
  id: "inc",
  name: "Getting Worse",
  unlocksAt: 3,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["incrementOne"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["incrementOne", "decrementOne"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.8,
        legalNonsense: ["incrementOne", "decrementOne"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.6,
        legalNonsense: ["decrementOne", "incrementMany"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.5,
        legalNonsense: ["incrementMany", "decrementOne", "incrementOne"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
  ],
};

const GettingWorser: CampaignSet = {
  id: "doubler",
  name: "Getting Worser",
  unlocksAt: 7,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["doublerPlug"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 1,
        legalNonsense: ["doublerPlug"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.8,
        legalNonsense: ["incrementOne", "decrementOne", "doublerPlug"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 0.6,
        legalNonsense: [
          "decrementOne",
          "incrementMany",
          "doublerPlug",
          "incrementOne",
          "bigNumber",
        ],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: [
          "decrementOne",
          "incrementMany",
          "doublerPlug",
          "incrementOne",
          "bigNumber",
        ],
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
  ],
};

const Envelope: CampaignSet = {
  id: "round",
  name: "Back Of The Envelope",
  unlocksAt: 11,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["roundSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 1,
        legalNonsense: ["roundSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.8,
        legalNonsense: ["roundSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 0.6,
        legalNonsense: ["roundSocket", "bigNumber"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["roundSocket", "bigNumber"],
        nonsenseCounts: 2,
        useExpertBigs: true,
      },
    },
  ],
};

const Square: CampaignSet = {
  id: "square",
  name: "Right Angled",
  unlocksAt: 14,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["squareSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 1,
        legalNonsense: ["squareSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.8,
        legalNonsense: ["squareSocket", "roundSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 0.6,
        legalNonsense: ["squareSocket", "roundSocket", "bigNumber"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["squareSocket", "roundSocket", "bigNumber"],
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
  ],
};

const Reverse: CampaignSet = {
  id: "rev",
  name: "Getting Better?",
  unlocksAt: 18,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["reverseSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 1,
        legalNonsense: ["reverseSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.8,
        legalNonsense: ["reverseSocket", "bigNumber"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 0.6,
        legalNonsense: ["reverseSocket", "incrementOne", "doublerPlug"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["reverseSocket", "roundSocket", "squareSocket"],
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
  ],
};

const exam1Nonsense: Nonsense[] = [
  "bigNumber",
  "incrementOne",
  "incrementMany",
  "decrementOne",
  "doublerPlug",
  "roundSocket",
  "squareSocket",
  "reverseSocket",
];
const Exam1: CampaignSet = {
  id: "ex1",
  name: "A Trial Of Strength",
  unlocksAt: 23,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.4,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.3,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.2,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.1,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
    {
      id: "6",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.0,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
    {
      id: "7",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.9,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "8",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.8,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "9",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.6,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "10",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.5,
        legalNonsense: exam1Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
  ],
};

const Alt: CampaignSet = {
  id: "alt",
  name: "Back And Forth",
  unlocksAt: 36,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["alternate"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["alternate"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["alternate", "bigNumber"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.6,
        legalNonsense: ["alternate", "incrementMany", "reverseSocket"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["alternate", "roundSocket", "squareSocket"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
  ],
};

const Spawners: CampaignSet = {
  id: "spawn",
  name: "Seeing Double",
  unlocksAt: 41,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["cloneSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["cloneSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["splitSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.6,
        legalNonsense: ["splitSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["cloneSocket", "splitSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
  ],
};

const Parts: CampaignSet = {
  id: "parts",
  name: "Seeing... Something Else",
  unlocksAt: 45,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["partsSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["partsSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["partsSocket", "cloneSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.6,
        legalNonsense: ["partsSocket", "splitSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["partsSocket", "cloneSocket", "splitSocket"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
  ],
};

const RevNumber: CampaignSet = {
  id: "revplug",
  name: "Getting Better, But Worse",
  unlocksAt: 49,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["reversePlug"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["reversePlug"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["reversePlug", "cloneSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.6,
        legalNonsense: ["reversePlug", "squareSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["reversePlug", "incrementMany", "roundSocket"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
  ],
};

const exam2Nonsense: Nonsense[] = [
  "bigNumber",
  "incrementOne",
  "incrementMany",
  "decrementOne",
  "doublerPlug",
  "roundSocket",
  "squareSocket",
  "reverseSocket",
  "alternate",
  "cloneSocket",
  "splitSocket",
  "reversePlug",
  "partsSocket",
];
const Exam2: CampaignSet = {
  id: "ex2",
  name: "Another Trial Of Strength",
  unlocksAt: 55,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.4,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.3,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.2,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.1,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
    {
      id: "6",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.0,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
    {
      id: "7",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.9,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "8",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.8,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "9",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.6,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "10",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.5,
        legalNonsense: exam2Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
  ],
};

const Triangle: CampaignSet = {
  id: "triangle",
  name: "Wrong Angled",
  unlocksAt: 64,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["triangleSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["triangleSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["triangleSocket", "bigNumber"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.6,
        legalNonsense: ["triangleSocket", "squareSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["triangleSocket", "decrementOne", "cloneSocket"],
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
  ],
};

const Target: CampaignSet = {
  id: "target",
  name: "On Target",
  unlocksAt: 68,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["targetIncrementOne"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["targetDecrementOne"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["targetIncrementMany"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.6,
        legalNonsense: ["targetDecrementMany"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["targetReverse"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
  ],
};

const Sticky: CampaignSet = {
  id: "sticky",
  name: "Sticky",
  unlocksAt: 72,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["rotatePlug2"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["rotatePlug2"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["reversePlug2"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.6,
        legalNonsense: ["reversePlug2"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["rotatePlug2", "reversePlug2"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
  ],
};

const Prime: CampaignSet = {
  id: "prime",
  name: "A Prime Idea",
  unlocksAt: 75,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: ["primeSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1,
        legalNonsense: ["primeSocket"],
        nonsenseCounts: 1,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.8,
        legalNonsense: ["primeSocket", "incrementMany"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.6,
        legalNonsense: ["primeSocket", "alternate"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 0.5,
        legalNonsense: ["primeSocket", "roundSocket"],
        nonsenseCounts: 2,
        useExpertBigs: false,
      },
    },
  ],
};

const exam3Nonsense: Nonsense[] = [
  "bigNumber",
  "incrementOne",
  "incrementMany",
  "decrementOne",
  "doublerPlug",
  "roundSocket",
  "squareSocket",
  "reverseSocket",
  "alternate",
  "cloneSocket",
  "splitSocket",
  "reversePlug",
  "partsSocket",
  "triangleSocket",
  "targetDecrementMany",
  "targetDecrementOne",
  "targetIncrementMany",
  "targetIncrementOne",
  "targetReverse",
  "rotatePlug2",
  "reversePlug2",
  "primeSocket",
];
const Exam3: CampaignSet = {
  id: "ex3",
  name: "A Third Trial Of Strength",
  unlocksAt: 85,
  games: [
    {
      id: "1",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.5,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "2",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.4,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "3",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.3,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "4",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.2,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "5",
      profile: {
        bigsCount: 2,
        difficultyAllowance: 1.1,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
    {
      id: "6",
      profile: {
        bigsCount: 3,
        difficultyAllowance: 1.0,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
    {
      id: "7",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.9,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "8",
      profile: {
        bigsCount: 4,
        difficultyAllowance: 0.8,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "9",
      profile: {
        bigsCount: 1,
        difficultyAllowance: 0.6,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: false,
      },
    },
    {
      id: "10",
      profile: {
        bigsCount: 0,
        difficultyAllowance: 0.5,
        legalNonsense: exam3Nonsense,
        nonsenseCounts: 3,
        useExpertBigs: true,
      },
    },
  ],
};

export const campaignDefinition: Campaign = {
  sets: [
    Basic,
    GettingWorse,
    GettingWorser,
    Envelope,
    Square,
    Reverse,
    Exam1,
    Alt,
    Spawners,
    Parts,
    RevNumber,
    Exam2,
    Triangle,
    Target,
    Sticky,
    Prime,
    Exam3,
  ],
};
