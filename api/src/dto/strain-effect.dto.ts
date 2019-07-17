
export class StrainEffectDto {
    effect_id: number;
    effect_type_id: number;
    strain_id: number;
    label: string;
    effect_type: StrainEffectTypeDto;
}

export class StrainEffectsDto {
    positive: StrainEffectDto[];
    negative: StrainEffectDto[];
    medical: StrainEffectDto[];
}

export class StrainEffectTypeDto {
    effect_type_id: number;
    code: string;
    label: string;
}