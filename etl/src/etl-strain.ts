
// json model for strain object
export interface EtlStrain {
    id: number;
    name: string;
    race: string;
    flavors: string[];
    effects: EtlStrainEffects;
}

// json model for effects object
export interface EtlStrainEffects {
    positive: string[];
    negative: string[];
    medical: string[];
}
