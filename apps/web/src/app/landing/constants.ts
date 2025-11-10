export const SECTION_IDS = {
	hero: "hero",
	features: "features",
	process: "process",
	benefits: "benefits",
	integrations: "integrations",
	testimonials: "testimonials",
	pricing: "pricing",
	contact: "contact",
} as const;

export type SectionId = keyof typeof SECTION_IDS;

