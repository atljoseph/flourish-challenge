
/**
 * @class StrainEffectTypeEntity
 * Representation of the relational strain effect type entity.
 */
export class StrainEffectTypeEntity {
    // db props
    effect_type_id: number;
    code: string;
    label: string;
}

/**
 * Representation of the relational strain effect entity.
 */
export class StrainEffectEntity {
    // db props
    effect_id: number;
    effect_type_id: number;
    strain_id: number;
    label: string;

    // virtual props
    effect_type: StrainEffectTypeEntity;
}

