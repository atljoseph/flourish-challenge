import { Router } from 'express';
import { StrainBusiness, ValidationError } from 'lib';
import { GetStrainsResponseDto } from '../dto/response/get-strains.response.dto';
import { catchAsyncErrorsMiddleware } from '../middleware';
import { BaseResponseDto, GetStrainRacesResponseDto, GetStrainEffecTypesResponseDto } from '../dto/response';

const route = Router();

// for consumer to load of all strains
route.get('/all', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainsResponseDto();
    const strainBusiness = new StrainBusiness();
    res.dto.strains = await strainBusiness.getAllStrainsLite();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to load detail for a specific strain
route.get('/:strain_id', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainsResponseDto();
    const strainBusiness = new StrainBusiness();
    const strain_id = parseInt(req.params.strain_id);
    if (isNaN(strain_id)) throw new ValidationError('strain_id is invalid');
    res.dto.strains = await strainBusiness.getStrainDetailById(strain_id);
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to delete a specific strain
route.delete('/:strain_id', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new BaseResponseDto();
    const strainBusiness = new StrainBusiness();
    const strain_id = parseInt(req.params.strain_id);
    if (isNaN(strain_id)) throw new ValidationError('strain_id is invalid');
    await strainBusiness.deleteStrainById(strain_id);
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to load effect types
route.get('/effect-type', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainEffecTypesResponseDto();
    const strainBusiness = new StrainBusiness();
    res.dto.effectTypes = await strainBusiness.getStrainEffectTypes();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to load effect races
route.get('/race', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainRacesResponseDto();
    const strainBusiness = new StrainBusiness();
    res.dto.races = await strainBusiness.getStrainRaces();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

export const strainRoute = route;