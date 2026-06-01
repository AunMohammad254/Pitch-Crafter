export interface User {
  id: string;
  email?: string;
}

export interface PitchData {
  name: string;
  tagline: string;
  elevator_pitch: string;
  problem: string;
  solution: string;
  target_audience?: {
    description: string;
    segments: string[];
  };
  unique_value_proposition: string;
  landing_copy?: {
    headline: string;
    subheadline: string;
    call_to_action: string;
  };
  industry: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  logo_ideas: string[];
}

export interface Pitch {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  short_description: string;
  industry: string;
  tone?: string;
  language?: string;
  generated_data: PitchData;
  landing_code?: string;
  logo_svg?: string;
}

export interface PitchVersion {
  id: string;
  pitch_id: string;
  created_at: string;
  generated_data: PitchData;
  landing_code?: string;
}
