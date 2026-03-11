export interface AppConfig {
    relationshipStartDate: string;
}

export interface AppEvent {
    id: string;
    title: string;
    dateISO: string;
    iconType: string;
    type?: 'meeting' | 'anniversary'; // NEW: Added in Phase 3
    location?: string; // NEW: Added in Phase 3
    daysLeft?: number;
}

export interface AppMemory {
    id: string;
    title: string;
    description: string;
    dateISO: string;
    image?: string; // Deprecated single image
    images?: string[]; // NEW: Added in Phase 3 for multiple images
}

export interface AppProfilePreferences {
    showEvents?: boolean;
    showMemories?: boolean;
    customTags?: string[];
}

export interface AppProfile {
    name: string;
    avatar_url?: string;
    bio?: string;
    preferences?: AppProfilePreferences;
    ringSize: string;
    coffeePreference: string;
    favoriteColor: string;
    favoriteFood: string;
    favoritePolitician: string;
    supportedParty: string;
    favoriteYDCharacter: string;
    favoriteTimePeriod: string;
    firstDateLocation: string;
    importantNote: string;
}
