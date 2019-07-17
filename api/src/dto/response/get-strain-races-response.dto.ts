
import { BaseResponseDto } from "./base-response.dto";
import { StrainRaceDto } from "../strain-race.dto";

export class GetStrainRacesResponseDto extends BaseResponseDto {
    races: StrainRaceDto[];
}
