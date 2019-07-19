
/**
 * Internal model used to load strain data from json file.
 */
export interface StrainEtlModel {
    id: number;
    name: string;
    race: string;
    flavors: string[];
    effects: StrainEffectsEtlModel;
}

/**
 * Internal model used to load strain data from json file.
 */
export interface StrainEffectsEtlModel {
    positive: string[];
    negative: string[];
    medical: string[];
}
