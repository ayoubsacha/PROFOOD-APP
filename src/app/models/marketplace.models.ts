export interface MegaMenuGroup {
  title: string;
  links: string[];
}

export interface NavItem {
  label: string;
  href: string;
  megaKey?: string;
}

export interface CategoryCard {
  icon: string;
  title: string;
  description: string;
  count: string;
  tone: string;
}

export interface Opportunity {
  title: string;
  category: string;
  description: string;
  badge: string;
  accent: string;
}
