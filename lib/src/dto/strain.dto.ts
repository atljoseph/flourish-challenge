import { StrainRaceDto } from "./strain-race.dto";
import { StrainFlavorDto } from "./strain-flavor.dto";
import { StrainEffectsDto } from "./strain-effect.dto";

/**
 * Data transmission object for strain.
 */
export class StrainDto {
    strain_id: number;
    name: string;
    race_id: number;
    race: StrainRaceDto;
    flavors: StrainFlavorDto[];
    effects: StrainEffectsDto;
}
