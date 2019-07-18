
import { BaseResponseDto } from "./base-response.dto";
import { StrainEffectTypeDto } from "lib";

export class GetStrainEffecTypesResponseDto extends BaseResponseDto {
    effectTypes: StrainEffectTypeDto[];
}
