export interface NavLink {
  label: string;
  href: string;
  children?: NavChildLink[];
}

export interface NavChildLink {
  label: string;
  href: string;
}

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
