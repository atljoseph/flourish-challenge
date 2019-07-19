import { StrainRaceEntity } from "./strain-race";
import { StrainFlavorEntity } from "./strain-flavor";
import { StrainEffectEntity } from "./strain-effect";

/**
 * Representation of the relational strain entity.
 */
export class StrainEntity {
    // db props
    strain_id: number;
    name: string;
    race_id: number;
    
    // virtual props
    race: StrainRaceEntity;
    flavors: StrainFlavorEntity[];
    effects: StrainEffectEntity[];
}
