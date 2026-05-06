export interface NavItem {
    title: string;
    href: string;
    icon: string;
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

export interface NavConfig {
    sections: NavSection[];
}