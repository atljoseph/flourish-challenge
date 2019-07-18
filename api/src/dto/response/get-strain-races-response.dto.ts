
import { BaseResponseDto } from "./base-response.dto";
import { StrainRaceDto } from "lib";

export class GetStrainRacesResponseDto extends BaseResponseDto {
    races: StrainRaceDto[];
}
