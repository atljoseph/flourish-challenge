
import { BaseResponseDto } from "./base-response.dto";
import { StrainDto } from "lib";

export class CreateStrainResponseDto extends BaseResponseDto {
    strain: StrainDto;
}
