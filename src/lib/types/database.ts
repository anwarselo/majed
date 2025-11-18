export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Business = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  address_json: Json | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      visibletoai_businesses: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          website: string | null;
          phone: string | null;
          address_json: Json | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          website?: string | null;
          phone?: string | null;
          address_json?: Json | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          website?: string | null;
          phone?: string | null;
          address_json?: Json | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      visibletoai_assets: {
        Row: {
          id: string;
          business_id: string;
          file_path: string;
          mime_type: string;
          sha256: string | null;
          ocr_text: string | null;
          meta: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          file_path: string;
          mime_type: string;
          sha256?: string | null;
          ocr_text?: string | null;
          meta?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          file_path?: string;
          mime_type?: string;
          sha256?: string | null;
          ocr_text?: string | null;
          meta?: Json | null;
          created_at?: string;
        };
      };
      visibletoai_public_pages: {
        Row: {
          id: string;
          business_id: string;
          url: string;
          html_render: string;
          jsonld: Json;
          last_published_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          url: string;
          html_render: string;
          jsonld: Json;
          last_published_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          url?: string;
          html_render?: string;
          jsonld?: Json;
          last_published_at?: string;
        };
      };
      visibletoai_index_events: {
        Row: {
          id: string;
          business_id: string | null;
          url: string;
          event_type: string;
          status: number | null;
          response: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id?: string | null;
          url: string;
          event_type: string;
          status?: number | null;
          response?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string | null;
          url?: string;
          event_type?: string;
          status?: number | null;
          response?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
