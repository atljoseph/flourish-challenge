
export interface EtlStrain {
    id: number;
    name: string;
    race: string;
    flavors: string[];
    effects: EtlStrainEffects;
}

export interface EtlStrainEffects {
    positive: string[];
    negative: string[];
    medical: string[];
}
