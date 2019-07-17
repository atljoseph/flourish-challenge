
import { BaseResponseDto } from "./base-response.dto";
import { StrainDto } from "../strain.dto";

export class GetStrainsResponseDto extends BaseResponseDto {
    strains: StrainDto[];
}
