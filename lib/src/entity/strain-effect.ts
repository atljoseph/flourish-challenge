
export class StrainEffectTypeEntity {
    // db props
    effect_type_id: number;
    code: string;
    label: string;
}

export class StrainEffectEntity {
    // db props
    effect_id: number;
    effect_type_id: number;
    strain_id: number;
    label: string;

    // virtual props
    effect_type: StrainEffectTypeEntity;
}

