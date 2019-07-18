
// json model for strain object
export interface StrainEtlModel {
    id: number;
    name: string;
    race: string;
    flavors: string[];
    effects: StrainEffectsEtlModel;
}

// json model for effects object
export interface StrainEffectsEtlModel {
    positive: string[];
    negative: string[];
    medical: string[];
}
