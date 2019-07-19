
import { StrainFlavorEntity, StrainEffectTypeEntity, StrainEntity, StrainRaceEntity, StrainEffectEntity } from '../entity';
import { StrainRepository } from '../repository/strain-repository';
import { strainMapper } from '../mapping';
import { StrainDto, StrainFlavorDto, StrainRaceDto, StrainEffectTypeDto } from '../dto';
import { StrainEtlModel, StrainSearchModel} from '../model';
import { ValidationError } from '../error/validation-error';

/**
 * This class holds all the business logic for strain (and related) manipulation.
 */
export class StrainBusiness {
    // throwing error hear will bubble up to route or controller
    private _strainRepo: StrainRepository;

    // would ideally like to use a redis cache here
    private _cacheIsInitialized: boolean = false;
    private _cachedStrainRaces: StrainRaceEntity[] = [];
    private _cachedStrainEffectTypes: StrainEffectTypeEntity[] = [];

    constructor() {        
        // this will throw on its own error if applicable
        this._strainRepo = new StrainRepository();
    }
    /**
     * Load static data from DB upon load.
     */
    private async _loadIfNotLoaded() {
        if (!this._cacheIsInitialized) {
            console.log(`${this.constructor.name}.loadCache()`);
            // would ideally like to use a redis cache here
            this._cacheIsInitialized = true;
            this._cachedStrainRaces = await this._strainRepo.getStrainRaces();
            this._cachedStrainEffectTypes = await this._strainRepo.getStrainEffectTypes();
        }
    }
    /**
     * Use [StrainEtlModel] to write a Strain to the database.
     */
    async createStrainDetailFromEtl(etl: StrainEtlModel, isIdentityInsert?: boolean): Promise<number> {
        console.log(`${this.constructor.name}.createStrainDetailFromEtl()`, etl);
        await this._loadIfNotLoaded();
        const dto = strainMapper.mapEtlToStrainDto(etl, this._cachedStrainRaces, this._cachedStrainEffectTypes);
        const newStrainId = await this.createStrainDetailFromDto(dto, isIdentityInsert);
        return newStrainId;
    }
    /**
     * Use [StrainDto] to write a Strain to the database.
     */
    async createStrainDetailFromDto(dto: StrainDto, isIdentityInsert?: boolean): Promise<number> {
        console.log(`${this.constructor.name}.createStrainDetailFromDto()`, dto);
        await this._loadIfNotLoaded();
        const entity = strainMapper.mapToStrainEntity(dto);
        const newStrainId = await this._strainRepo.createStrainDetail(entity, isIdentityInsert);
        return newStrainId;
    }
    /**
     * Use [StrainDto] to update a Strain Detail in the database.
     */
    async updateStrainDetail(dto: StrainDto): Promise<number> {
        console.log(`${this.constructor.name}.updateStrainDetail()`, dto);
        await this._loadIfNotLoaded();
        const entity = strainMapper.mapToStrainEntity(dto);
        const updatedStrainId = await this._strainRepo.updateStrainDetail(entity);
        return updatedStrainId;
    }
    /**
     * Delete a Strain (and all of its Flavors and Effects) by Strain Id.
     */
    async deleteStrainById(strainId: number): Promise<boolean> {
        console.log(`${this.constructor.name}.deleteStrainById()`, strainId);
        await this._loadIfNotLoaded();
        const entity = await this.getStrainDetailById(strainId);
        await this._strainRepo.deleteStrainById(entity.strain_id);
        return true;
    }
    /**
     * Get a list of all strains.
     * Note: Does not return detail records.
     */
    async getStrainLitesAll(): Promise<StrainDto[]> {
        console.log(`${this.constructor.name}.getStrainLitesAll()`);
        await this._loadIfNotLoaded();
        const entities = await this._strainRepo.getStrainLitesAll();
        const dtos = entities.map(e => strainMapper.mapToStrainDto(e, this._cachedStrainRaces, this._cachedStrainEffectTypes, false));
        return dtos;
    }
    /**
     * Get Strain Detail record by Id. Includes all Flavors and Effects.
     */
    async getStrainDetailById(strainId: number): Promise<StrainDto> {
        console.log(`${this.constructor.name}.getStrainDetailById()`, strainId);
        await this._loadIfNotLoaded();
        const entity = await this._strainRepo.getStrainDetailById(strainId);
        if (!entity) throw new ValidationError(`${this.constructor.name}Error: strain_id ${strainId} not found.`)
        const dto = strainMapper.mapToStrainDto(entity, this._cachedStrainRaces, this._cachedStrainEffectTypes, true);
        return dto;
    }
    /**
     * Search Strains by Name, Race, Flavor, Effect, and Effect Type.
     */
    async searchStrainDetails(searchModel: StrainSearchModel): Promise<StrainDto[]> {
        console.log(`${this.constructor.name}.searchStrainLites()`, searchModel);
        await this._loadIfNotLoaded();

        searchModel.searchName = searchModel.searchName || '';
        searchModel.searchFlavor = searchModel.searchFlavor || '';
        searchModel.searchEffect = searchModel.searchEffect || '';
        searchModel.searchEffectType = searchModel.searchEffectType || '';
        searchModel.searchRace = searchModel.searchRace || '';

        const race = this._cachedStrainRaces.find((race) => race.code.toLowerCase() === searchModel.searchRace.toLowerCase());
        if (searchModel.searchRace && !race) throw new ValidationError('Invalid Search Input for Race');
        else if (race) searchModel.searchRaceId = race.race_id;

        const effectType = this._cachedStrainEffectTypes.find((type) => type.code.toLowerCase() === searchModel.searchEffectType.toLowerCase());
        if (searchModel.searchEffectType && !effectType) throw new ValidationError('Invalid Search Input for EffectType');
        else if (effectType) searchModel.searchEffectTypeId = effectType.effect_type_id;

        const strainIds = await this._strainRepo.searchStrainIds(searchModel);
        const strainLiteEntities = await this._strainRepo.getStrainLitesByIds(strainIds);

        const dtos = strainLiteEntities.map(e => strainMapper.mapToStrainDto(e, this._cachedStrainRaces, this._cachedStrainEffectTypes, false)); 

        return dtos;
    }
    /**
     * Get a list of all Strain Races.
     */
    async getStrainRaces(): Promise<StrainRaceDto[]> {
        console.log(`${this.constructor.name}.getStrainRaces()`);
        await this._loadIfNotLoaded();
        const entities = this._cachedStrainRaces; //await this._strainRepo.getStrainRaces();
        const dtos = entities; // pass through // no mapping
        return dtos;
    }
    /**
     * Get a list of all Strain Effect Types.
     */
    async getStrainEffectTypes(): Promise<StrainEffectTypeDto[]> {
        console.log(`${this.constructor.name}.getStrainEffectTypes()`);
        await this._loadIfNotLoaded();
        const entities = await this._cachedStrainEffectTypes; //await this._strainRepo.getStrainEffectTypes();
        const dtos = entities; // pass through // no mapping
        return dtos;
    }
}

