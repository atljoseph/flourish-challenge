
import { BaseResponseDto } from "./base-response.dto";
import { StrainEffectTypeDto } from "../strain-effect.dto";

export class GetStrainEffecTypesResponseDto extends BaseResponseDto {
    effectTypes: StrainEffectTypeDto[];
}
