export class DataManager {
    private static instance: DataManager;

    public items: Record<number, string> = {};
    public pokemon: Record<number, string> = {};
    public moves: Record<number, string> = {};
    public currentLanguage: string = 'en';
    public currentGameType: string = 'Sky';

    private constructor() { }

    public static getInstance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }
        return DataManager.instance;
    }

    public async setLanguage(lang: string): Promise<void> {
        this.currentLanguage = lang;
        await this.loadData(this.currentGameType);
    }

    public async loadData(gameType: string = 'Sky'): Promise<void> {
        this.currentGameType = gameType;
        try {
            const prefix = gameType === 'RescueTeam' ? 'RB' : (gameType === 'TimeDarkness' ? 'TD' : 'Sky');

            await Promise.all([
                this.loadItems(prefix),
                this.loadPokemon(prefix),
                this.loadMoves(prefix)
            ]);
        } catch (e) {
            console.error("Failed to load data resources", e);
        }
    }

    private async loadItems(prefix: string) {
        try {
            const response = await fetch(`/resources/${this.currentLanguage}/${prefix}Items.txt`);
            if (!response.ok) throw new Error("404");
            const text = await response.text();
            this.items = this.parseResource(text);
        } catch {
            // Fallback to Sky if not found? or Empty.
            console.warn(`Failed to load ${prefix}Items.txt`);
            this.items = {};
        }
    }

    private async loadPokemon(prefix: string) {
        try {
            const response = await fetch(`/resources/${this.currentLanguage}/${prefix}Pokemon.txt`);
            if (!response.ok) throw new Error("404");
            const text = await response.text();
            this.pokemon = this.parseResource(text);
        } catch {
            console.warn(`Failed to load ${prefix}Pokemon.txt`);
            this.pokemon = {};
        }
    }

    private async loadMoves(prefix: string) {
        try {
            const response = await fetch(`/resources/${this.currentLanguage}/${prefix}Moves.txt`);
            if (!response.ok) throw new Error("404");
            const text = await response.text();
            this.moves = this.parseResource(text);
        } catch {
            console.warn(`Failed to load ${prefix}Moves.txt`);
            this.moves = {};
        }
    }

    private parseResource(text: string): Record<number, string> {
        const map: Record<number, string> = {};
        const lines = text.split('\n');
        for (const line of lines) {
            if (!line.trim()) continue;
            // Format: ID=Name
            const parts = line.split('=');
            if (parts.length >= 2) {
                const id = parseInt(parts[0].trim());
                if (!isNaN(id)) {
                    // Start of Name (can contain =)
                    const name = parts.slice(1).join('=').trim();
                    map[id] = name;
                }
            }
        }
        return map;
    }

    public getItemName(id: number): string {
        return this.items[id] || `Unknown Item (${id})`;
    }

    public getPokemonName(id: number): string {
        return this.pokemon[id] || `Unknown Pokemon (${id})`;
    }

    public getMoveName(id: number): string {
        return this.moves[id] || `Unknown Move (${id})`;
    }
}
