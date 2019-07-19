
/**
 * Data transmission object for strain effect.
 */
export class StrainEffectDto {
    effect_id: number;
    effect_type_id: number;
    strain_id: number;
    label: string;
    effect_type: StrainEffectTypeDto;
}


/**
 * Data transmission object for strain effects set.
 * This is the primary difference between Entity and Dto forms of Strain models.
 */
export class StrainEffectsDto {
    positive: StrainEffectDto[];
    negative: StrainEffectDto[];
    medical: StrainEffectDto[];
}

/**
 * Data transmission object for strain effect type.
 */
export class StrainEffectTypeDto {
    effect_type_id: number;
    code: string;
    label: string;
}