
import * as config from 'config';

import { MysqlDatabaseConfig, MysqlDatabase } from '../database/mysql-database';
import { StrainFlavorEntity, StrainEffectTypeEntity, StrainEntity, StrainRaceEntity, StrainEffectEntity } from '../entity';
import { asyncForEach } from '../util/async-foreach';
import { BusinessError } from '../error/business-error';
import { StrainRepository } from '../repository/strain-repository';
import { strainMapper } from '../mapping';
import { StrainDto, StrainFlavorDto, StrainRaceDto, StrainEffectTypeDto } from '../dto';
import { StrainEtlModel } from '../model';

export class StrainBusiness {
    // throwing error hear will bubble up to route or controller
    private _strainRepo: StrainRepository;
    private _cacheIsInitialized: boolean = false;
    private _cachedStrainRaces: StrainRaceEntity[] = [];
    private _cachedStrainEffectTypes: StrainEffectTypeEntity[] = [];
    constructor() {
        let db_config: MysqlDatabaseConfig;
        try {
            // this gets read from the invoking module's config 
            // config folder and default.json file do not have to live in this project
            db_config = <MysqlDatabaseConfig>config.get(`databases.strainsDb`);
        }
        catch (err) {
            throw new BusinessError(`${this.constructor.name} - Error Invalid Database Configuration`, err);
        }
        // this will throw on its own:
        this._strainRepo = new StrainRepository(db_config);

    }
    private async _loadIfNotLoaded() {
        if (!this._cacheIsInitialized) {
            this._cacheIsInitialized = true;
            this._cachedStrainRaces = await this._strainRepo.getStrainRaces();
            this._cachedStrainEffectTypes = await this._strainRepo.getStrainEffectTypes();
        }
    }
    async createStrainFromEtl(etl: StrainEtlModel, isIdentityInsert?: boolean): Promise<number> {
        console.log(`${this.constructor.name}.createStrainFromEtl()`);
        await this._loadIfNotLoaded();
        const dto = strainMapper.mapEtlToStrainDto(etl, this._cachedStrainRaces, this._cachedStrainEffectTypes);
        const newStrainId = await this.createStrainFromDto(dto, isIdentityInsert);
        return newStrainId;
    }
    async createStrainFromDto(dto: StrainDto, isIdentityInsert?: boolean): Promise<number> {
        console.log(`${this.constructor.name}.createStrainFromDto()`, dto);
        await this._loadIfNotLoaded();
        const entity = strainMapper.mapToStrainEntity(dto);
        const newStrainId = await this._strainRepo.createStrain(entity, isIdentityInsert);
        return newStrainId;
    }
    async updateStrain(dto: StrainDto): Promise<number> {
        console.log(`${this.constructor.name}.updateStrain()`, dto);
        await this._loadIfNotLoaded();
        const entity = strainMapper.mapToStrainEntity(dto);
        const updatedStrainId = await this._strainRepo.updateStrain(entity);
        return updatedStrainId;
    }
    async deleteStrainById(strainId: number): Promise<boolean> {
        console.log(`${this.constructor.name}.deleteStrainById()`, strainId);
        await this._loadIfNotLoaded();
        const entity = await this.getStrainDetailById(strainId);
        return await this._strainRepo.deleteStrainById(entity.strain_id);
    }
    async getAllStrainsLite(): Promise<StrainDto[]> {
        console.log(`${this.constructor.name}.getAllStrains()`);
        await this._loadIfNotLoaded();
        const entities = await this._strainRepo.getAllStrains();
        const dtos = entities.map(e => strainMapper.mapToStrainDto(e, this._cachedStrainRaces, this._cachedStrainEffectTypes, false));
        return dtos;
    }
    async getStrainDetailById(strainId: number): Promise<StrainDto> {
        console.log(`${this.constructor.name}.getStrainDetailById()`, strainId);
        await this._loadIfNotLoaded();
        const entity = await this._strainRepo.getStrainDetailById(strainId);
        if (!entity) throw new BusinessError(`${this.constructor.name}Error: strain_id ${strainId} not found.`)
        const dto = strainMapper.mapToStrainDto(entity, this._cachedStrainRaces, this._cachedStrainEffectTypes, true);
        return dto;
    }
    async getStrainsLiteByIds(strainIds: number[]): Promise<StrainDto[]> {
        console.log(`${this.constructor.name}.getStrainsByIds()`);
        await this._loadIfNotLoaded();
        const entities = await this._strainRepo.getStrainsByIds(strainIds);
        const dtos = entities.map(e => strainMapper.mapToStrainDto(e, this._cachedStrainRaces, this._cachedStrainEffectTypes, false)); 
        return dtos;
    }
    async searchStrainsLite(searchContext: any): Promise<StrainDto[]> {
        console.log(`${this.constructor.name}.searchStrains()`, searchContext);
        await this._loadIfNotLoaded();
        const entities = await this._strainRepo.searchStrains(searchContext);
        const dtos = entities.map(e => strainMapper.mapToStrainDto(e, this._cachedStrainRaces, this._cachedStrainEffectTypes, false)); 
        return dtos;
    }
    async getStrainRaces(): Promise<StrainRaceDto[]> {
        console.log(`${this.constructor.name}.getStrainRaces()`);
        await this._loadIfNotLoaded();
        const entities = this._cachedStrainRaces; //await this._strainRepo.getStrainRaces();
        const dtos = entities; // pass through // no mapping
        return dtos;
    }
    async getStrainEffectTypes(): Promise<StrainEffectTypeDto[]> {
        console.log(`${this.constructor.name}.getStrainEffectTypes()`);
        await this._loadIfNotLoaded();
        const entities = await this._cachedStrainEffectTypes; //await this._strainRepo.getStrainEffectTypes();
        const dtos = entities; // pass through // no mapping
        return dtos;
    }
}

