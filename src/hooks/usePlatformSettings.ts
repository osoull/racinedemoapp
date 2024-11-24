import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PlatformSettings = {
  platform_name: string;
  maintenance_mode: boolean;
  support_email: string;
  min_investment: number;
  max_projects: number;
}

export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ['platform-settings', 'general'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .eq('category', 'general');
      
      if (error) throw error;

      const settings = data?.reduce((acc: any, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as PlatformSettings) || {};

      return {
        platform_name: settings.platform_name || 'منصة التمويل الجماعي',
        maintenance_mode: settings.maintenance_mode || false,
        support_email: settings.support_email || 'support@example.com',
        min_investment: settings.min_investment || 1000,
        max_projects: settings.max_projects || 10
      } as PlatformSettings;
    }
  });
};