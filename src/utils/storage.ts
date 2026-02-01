/**
 * LocalStorage wrapper for persistent data storage
 * Provides methods to save, load, and manage application data
 */

// Storage keys
const STORAGE_KEYS = {
    IDEAS: 'advisory_ai_ideas',
    PROMPTS: 'advisory_ai_prompts',
    SETTINGS: 'advisory_ai_settings',
} as const;

/**
 * Generic storage helper with JSON serialization
 */
export const storage = {
    /**
     * Get item from localStorage with JSON parsing
     */
    get<T>(key: string, defaultValue: T): T {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item) as T;
        } catch (error) {
            console.warn(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    },

    /**
     * Set item in localStorage with JSON serialization
     */
    set<T>(key: string, value: T): boolean {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     */
    remove(key: string): boolean {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
            return false;
        }
    },

    /**
     * Check if key exists in localStorage
     */
    exists(key: string): boolean {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Clear all app-related localStorage keys
     */
    clearAll(): void {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};

/**
 * Ideas-specific storage operations
 */
export const ideasStorage = {
    getKey: () => STORAGE_KEYS.IDEAS,

    /**
     * Check if any ideas are stored
     */
    hasStoredData(): boolean {
        return storage.exists(STORAGE_KEYS.IDEAS);
    },

    /**
     * Get stored ideas count
     */
    getStoredCount(): number {
        const ideas = storage.get<unknown[]>(STORAGE_KEYS.IDEAS, []);
        return ideas.length;
    }
};

/**
 * Prompts-specific storage operations
 */
export const promptsStorage = {
    getKey: () => STORAGE_KEYS.PROMPTS,

    /**
     * Check if any prompts are stored
     */
    hasStoredData(): boolean {
        return storage.exists(STORAGE_KEYS.PROMPTS);
    },

    /**
     * Get stored prompts count
     */
    getStoredCount(): number {
        const prompts = storage.get<unknown[]>(STORAGE_KEYS.PROMPTS, []);
        return prompts.length;
    }
};

/**
 * Export/Import functionality
 */
export const dataExport = {
    /**
     * Export all data as JSON
     */
    exportAll(): string {
        const data = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            ideas: storage.get(STORAGE_KEYS.IDEAS, []),
            prompts: storage.get(STORAGE_KEYS.PROMPTS, []),
            settings: storage.get(STORAGE_KEYS.SETTINGS, {})
        };
        return JSON.stringify(data, null, 2);
    },

    /**
     * Export data as downloadable file
     */
    downloadExport(filename = 'advisory-ai-export.json'): void {
        const data = this.exportAll();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Import data from JSON string
     */
    importData(jsonString: string): { success: boolean; message: string } {
        try {
            const data = JSON.parse(jsonString);

            if (!data.version) {
                return { success: false, message: 'Invalid export file: missing version' };
            }

            if (data.ideas && Array.isArray(data.ideas)) {
                storage.set(STORAGE_KEYS.IDEAS, data.ideas);
            }

            if (data.prompts && Array.isArray(data.prompts)) {
                storage.set(STORAGE_KEYS.PROMPTS, data.prompts);
            }

            if (data.settings && typeof data.settings === 'object') {
                storage.set(STORAGE_KEYS.SETTINGS, data.settings);
            }

            return { success: true, message: 'Data imported successfully' };
        } catch (error) {
            return { success: false, message: 'Failed to parse import file' };
        }
    }
};

export { STORAGE_KEYS };
