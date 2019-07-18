import { StrainRaceDto } from "./strain-race.dto";
import { StrainFlavorDto } from "./strain-flavor.dto";
import { StrainEffectsDto } from "./strain-effect.dto";

export class StrainDto {
    strain_id: number;
    name: string;
    race_id: number;
    race: StrainRaceDto;
    flavors: StrainFlavorDto[];
    effects: StrainEffectsDto;
}
