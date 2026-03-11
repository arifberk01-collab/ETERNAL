export interface AppConfig {
    relationshipStartDate: string;
}

export interface AppEvent {
    id: string;
    title: string;
    dateISO: string;
    iconType: string;
    daysLeft?: number;
}

export interface AppMemory {
    id: string;
    title: string;
    description: string;
    dateISO: string;
    image: string; // Base64
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
