import { Router } from 'express';
import { StrainBusiness } from 'lib';
import { GetStrainsResponseDto } from '../dto/response/get-strains.response.dto';
import { catchErrors } from '../middleware';
import { GetStrainFlavorsResponseDto } from '../dto/response/get-strain-flavors-response.dto';
import { GetStrainEffecTypesResponseDto } from '../dto/response/get-strain-effect-types-response.dto';
import { GetStrainRacesResponseDto } from '../dto/response/get-strain-races-response.dto';

const route = Router();

route.get('/all', [], catchErrors(async (req, res) => {
    res.dto = new GetStrainsResponseDto();
    const strainBusiness = new StrainBusiness();
    res.dto.strains = await strainBusiness.getAllStrains();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

route.get('/flavors', [], catchErrors(async (req, res) => {
    res.dto = new GetStrainFlavorsResponseDto();
    const strainBusiness = new StrainBusiness();
    res.dto.flavors = await strainBusiness.getStrainFlavors();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

route.get('/effect-types', [], catchErrors(async (req, res) => {
    res.dto = new GetStrainEffecTypesResponseDto();
    const strainBusiness = new StrainBusiness();
    res.dto.effectTypes = await strainBusiness.getStrainEffectTypes();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

route.get('/races', [], catchErrors(async (req, res) => {
    res.dto = new GetStrainRacesResponseDto();
    const strainBusiness = new StrainBusiness();
    res.dto.races = await strainBusiness.getStrainRaces();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

export const strainRoute = route;