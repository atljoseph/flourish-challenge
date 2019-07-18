
import { BaseResponseDto } from "./base-response.dto";
import { StrainFlavorDto } from "lib";

export class GetStrainFlavorsResponseDto extends BaseResponseDto {
    flavors: StrainFlavorDto[];
}
