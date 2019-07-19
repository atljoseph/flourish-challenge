
import { BaseResponseDto } from "./base-response.dto";
import { StrainDto } from "lib";

export class UpdateStrainResponseDto extends BaseResponseDto {
    strain: StrainDto;
}
