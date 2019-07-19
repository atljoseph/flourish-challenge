import { Router } from 'express';
import { StrainBusiness, ValidationError, StrainSearchModel } from 'lib';
import { catchAsyncErrorsMiddleware } from '../middleware';
import { 
    BaseResponseDto, 
    GetStrainRacesResponseDto, 
    GetStrainEffecTypesResponseDto, 
    CreateStrainResponseDto, 
    GetStrainsResponseDto ,
    UpdateStrainResponseDto
} from '../dto/response';
import { CreateStrainRequestDto, UpdateStrainRequestDto } from '../dto/request';

const route = Router();
const strainBusiness = new StrainBusiness();

// for consumer to create a new strain
route.post('/', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new CreateStrainResponseDto();
    const createStrainRequest = <CreateStrainRequestDto>req.body;
    const newStrainId = await strainBusiness.createStrainDetailFromDto(createStrainRequest.strain);
    res.dto.strain = await strainBusiness.getStrainDetailById(newStrainId);
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to update an existing strain
route.put('/', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new UpdateStrainResponseDto();
    const updateStrainRequest = <UpdateStrainRequestDto>req.body;
    const newStrainId = await strainBusiness.updateStrainDetail(updateStrainRequest.strain);
    res.dto.strain = await strainBusiness.getStrainDetailById(newStrainId);
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to load of all strains
route.get('/', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainsResponseDto();
    res.dto.strains = await strainBusiness.getStrainLitesAll();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to search strains
route.get('/search', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainsResponseDto();
    const searchModel = new StrainSearchModel();
    searchModel.searchName = req.query.name;
    searchModel.searchFlavor = req.query.flavor;
    searchModel.searchEffect = req.query.effect;
    searchModel.searchRace = req.query.race;
    searchModel.searchEffectType = req.query.effect_type;
    res.dto.strains = await strainBusiness.searchStrainDetails(searchModel);
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to load detail for a specific strain
route.get('/:strain_id', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainsResponseDto();
    const strain_id = parseInt(req.params.strain_id);
    if (isNaN(strain_id)) throw new ValidationError('strain_id is invalid');
    res.dto.strains = await strainBusiness.getStrainDetailById(strain_id);
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to delete a specific strain
route.delete('/:strain_id', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new BaseResponseDto();
    const strain_id = parseInt(req.params.strain_id);
    if (isNaN(strain_id)) throw new ValidationError('strain_id is invalid');
    await strainBusiness.deleteStrainById(strain_id);
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to load effect types
route.get('/effect-type', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainEffecTypesResponseDto();
    res.dto.effectTypes = await strainBusiness.getStrainEffectTypes();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

// for consumer to load effect races
route.get('/race', [], catchAsyncErrorsMiddleware(async (req, res) => {
    res.dto = new GetStrainRacesResponseDto();
    res.dto.races = await strainBusiness.getStrainRaces();
    res.dto.isSuccess = true;
    res.send(res.dto);
}));

export const strainRoute = route;