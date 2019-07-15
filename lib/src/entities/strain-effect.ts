
export class StrainEffectTypeEntity {
    effect_type_id: number;
    label: string;
}

export class StrainEffectEntity {
    effect_id: number;
    effect_type_id: number;
    strain_id: number;
    label: string;
}
