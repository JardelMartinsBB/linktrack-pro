// ===== src/types/database.ts =====
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan_type: 'free' | 'starter' | 'pro' | 'business'
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan_type?: 'free' | 'starter' | 'pro' | 'business'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan_type?: 'free' | 'starter' | 'pro' | 'business'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      short_links: {
        Row: {
          id: string
          user_id: string
          original_url: string
          short_code: string
          custom_domain: string | null
          title: string | null
          description: string | null
          favicon_url: string | null
          password_protected: boolean
          password_hash: string | null
          expires_at: string | null
          total_clicks: number
          unique_clicks: number
          last_clicked_at: string | null
          qr_code_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_url: string
          short_code: string
          custom_domain?: string | null
          title?: string | null
          description?: string | null
          favicon_url?: string | null
          password_protected?: boolean
          password_hash?: string | null
          expires_at?: string | null
          total_clicks?: number
          unique_clicks?: number
          last_clicked_at?: string | null
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          short_code?: string
          custom_domain?: string | null
          title?: string | null
          description?: string | null
          favicon_url?: string | null
          password_protected?: boolean
          password_hash?: string | null
          expires_at?: string | null
          total_clicks?: number
          unique_clicks?: number
          last_clicked_at?: string | null
          qr_code_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      link_clicks: {
        Row: {
          id: string
          short_link_id: string
          ip_address: string | null
          user_agent: string | null
          referer: string | null
          country: string | null
          region: string | null
          city: string | null
          device_type: string | null
          browser: string | null
          os: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          clicked_at: string
        }
        Insert: {
          id?: string
          short_link_id: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          region?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          clicked_at?: string
        }
        Update: {
          id?: string
          short_link_id?: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          region?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          clicked_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_short_code: {
        Args: {
          length?: number
        }
        Returns: string
      }
      can_create_link: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
