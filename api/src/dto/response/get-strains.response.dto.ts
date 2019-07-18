
import { BaseResponseDto } from "./base-response.dto";
import { StrainDto } from "lib";

export class GetStrainsResponseDto extends BaseResponseDto {
    strains: StrainDto[];
}
