
import { BaseResponseDto } from "./base-response.dto";
import { StrainFlavorDto } from "../strain-flavor.dto";

export class GetStrainFlavorsResponseDto extends BaseResponseDto {
    flavors: StrainFlavorDto[];
}
