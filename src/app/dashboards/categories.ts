export interface IDashboardCategory {
  hierarchy_number: string;
  id: number;
  parent: string;
  item_name: string;
  description?: string;
  keyword_content?: string;
  query_string?: string;
  icon?: string;
  bg_icon?: string;
  children?: IDashboardCategory[];
}
