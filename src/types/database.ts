export type PartType = 'battery' | 'glass' | 'display';
export type Confidence = 'verified' | 'community' | 'low';
export type CompatibilityStatus = 'active' | 'pending';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface Device {
  id: string;
  brand: string;
  model: string;
  model_code: string | null;
  created_at: string;
}

export interface DeviceAlias {
  id: string;
  device_id: string;
  alias: string;
  created_at: string;
}

export interface Part {
  id: string;
  type: PartType;
  name: string;
  brand: string;
  created_at: string;
}

export interface Compatibility {
  id: string;
  device_id: string;
  part_id: string;
  type: PartType;
  confidence: Confidence;
  status: CompatibilityStatus;
  created_at: string;
  parts?: Part;
}

export interface CompatibilityRequest {
  id: string;
  device_input: string;
  part_input: string;
  type: PartType;
  comment: string | null;
  status: RequestStatus;
  created_at: string;
}

export interface DeviceWithCompatibilities extends Device {
  batteries: CompatibilityRow[];
  glasses: CompatibilityRow[];
  displays: CompatibilityRow[];
}

export interface CompatibilityRow {
  id: string;
  name: string;
  brand: string;
  confidence: Confidence;
  part_id: string;
}

export type Database = {
  public: {
    Tables: {
      devices: {
        Row: Device;
        Insert: Omit<Device, 'id' | 'created_at'>;
        Update: Partial<Omit<Device, 'id' | 'created_at'>>;
      };
      device_aliases: {
        Row: DeviceAlias;
        Insert: Omit<DeviceAlias, 'id' | 'created_at'>;
        Update: Partial<Omit<DeviceAlias, 'id' | 'created_at'>>;
      };
      parts: {
        Row: Part;
        Insert: Omit<Part, 'id' | 'created_at'>;
        Update: Partial<Omit<Part, 'id' | 'created_at'>>;
      };
      compatibilities: {
        Row: Compatibility;
        Insert: Omit<Compatibility, 'id' | 'created_at' | 'parts'>;
        Update: Partial<Omit<Compatibility, 'id' | 'created_at' | 'parts'>>;
      };
      compatibility_requests: {
        Row: CompatibilityRequest;
        Insert: Omit<CompatibilityRequest, 'id' | 'created_at'>;
        Update: Partial<Omit<CompatibilityRequest, 'id' | 'created_at'>>;
      };
    };
  };
};
