export type Priority = 'HERO' | 'SUPPORTING' | 'EXPERIMENTAL';

export interface Product {
  id: string;
  name: string;
  link: string;
  priority: Priority;
}

export interface HeroInsight {
  used: string;
  likes: string;
  dislikes: string;
  recommendTo: string;
}

export interface Reference {
  id: string;
  link: string;
  reason: string;
}

export interface CampaignBrief {
  startDate: string;
  endDate: string;
  primaryGoal: string;
  theme: string;
  trigger: string;
  formats: string[];
  products: Product[];
  inventoryPush: string;
  heroInsights: Record<string, HeroInsight>;
  customerQuestions: string;
  customerReasons: string;
  customerFears: string;
  customerUnknowns: string;
  anecdote: string;
  promotedBefore: string;
  promotedResult: string;
  exclusive: string;
  avoid: string;
  references: Reference[];
  mandatoryMessages: string;
  donts: string[];
  otherDont: string;
  continuity: string;
  cta: string;
  otherCta: string;
  shootAvailability: string;
  propsReq: string;
  location: string;
  anythingElse: string;
}

export const INITIAL_BRIEF: CampaignBrief = {
  startDate: '',
  endDate: '',
  primaryGoal: '',
  theme: '',
  trigger: '',
  formats: [],
  products: [
    { id: '1', name: '', link: '', priority: 'HERO' }
  ],
  inventoryPush: '',
  heroInsights: {},
  customerQuestions: '',
  customerReasons: '',
  customerFears: '',
  customerUnknowns: '',
  anecdote: '',
  promotedBefore: '',
  promotedResult: '',
  exclusive: '',
  avoid: '',
  references: [],
  mandatoryMessages: '',
  donts: [],
  otherDont: '',
  continuity: '',
  cta: '',
  otherCta: '',
  shootAvailability: '',
  propsReq: '',
  location: '',
  anythingElse: ''
};
