import { StrainRaceDto } from "./strain-race.dto";
import { StrainFlavorDto } from "./strain-flavor.dto";
import { StrainEffectDto } from "./strain-effect.dto";

export class StrainDto {
    strain_id: number;
    name: string;
    race: StrainRaceDto;
    flavors: StrainFlavorDto[];
    effects: StrainEffectDto[];
}
