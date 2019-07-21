
import * as config from 'config';
import * as util from 'util';

import { StrainFlavorEntity, StrainEffectTypeEntity, StrainEntity, StrainRaceEntity, StrainEffectEntity } from '../entity';
import { asyncForEach } from '../util';
import { DatabaseError } from '../error';
import { database } from '../database';
import { StrainSearchModel } from '../model/strain-search.model';

/**
 * The StrainRespository is where raw objects are read, updated, and inserted. This is where the SQL Statements live.
 * This class should be instantiated by a Business class.
 */
export class StrainRepository {
    /**
     * Create Strain Detail from an entity object.
     */
    async createStrainDetail(entity: StrainEntity, isIdentityInsert?: boolean): Promise<number> {
        return new Promise<number>((async (resolve, reject) => {
            console.log(`${this.constructor.name}.createStrainDetail()`, entity.name);

            const transaction = await database.strain.transaction();
            try {
                const statement1 = `insert into strain (${isIdentityInsert ? 'strain_id, ' : ''}name, race_id) values (${isIdentityInsert ? '?, ' : ''}?, ?);`;
                const values1: any[] = [];
                if (isIdentityInsert) {
                    values1.push(entity.strain_id);
                }
                values1.push(entity.name);
                values1.push(entity.race_id);
                const newStrainId = await database.strain.insertQuery(transaction, statement1, values1);

                if (entity.flavors && entity.flavors.length > 0) {
                    const statement2 = `insert into strain_flavor (strain_id, label) values ?;`;
                    const values2 = [entity.flavors.map((flavor) => [newStrainId, flavor.label])];
                    await database.strain.insertQuery(transaction, statement2, values2);
                }

                if (entity.effects && entity.effects.length > 0) {
                    const statement3 = `insert into strain_effect (effect_type_id, strain_id, label) values ?;`;
                    const values3 = [entity.effects.map((effect) => [effect.effect_type_id, newStrainId, effect.label])];
                    await database.strain.insertQuery(transaction, statement3, values3);
                }

                await database.strain.commit(transaction);
                resolve(newStrainId);
            }
            catch (err) {
                await database.strain.rollback(transaction);
                console.error(err);
                reject(new DatabaseError(`${this.constructor.name}Error Inserting Strain Detail via transaction`, err));
            }
        }));
    }
    /**
     * Update Strain Detail from an entity object.
     * For Flavors and Effects, this will delete and replace any records that changed.
     */
    async updateStrainDetail(incomingEntity: StrainEntity, existingEntity: StrainEntity): Promise<number> {
        return new Promise<number>((async (resolve, reject) => {
            console.log(`${this.constructor.name}.updateStrainDetail()`, incomingEntity, existingEntity);

            const flavorsToDelete = ((existingEntity && existingEntity.flavors) || [])
                .filter((existing) => {
                    const exists = (incomingEntity.flavors || []).findIndex((incoming) => existing.label === incoming.label) > -1;
                    return !exists;
                });
            const flavorsToInsert = (incomingEntity.flavors || [])
                .filter((incoming) => {
                    const exists = ((existingEntity && existingEntity.flavors) || []).findIndex((existing) => incoming.label === existing.label) > -1;
                    return !exists;
                });

            const effectsToDelete = ((existingEntity && existingEntity.effects) || [])
                .filter((existing) => {
                    const exists = (incomingEntity.effects || []).findIndex((incoming) => existing.label === incoming.label) > -1;
                    return !exists;
                });
            const effectsToInsert = (incomingEntity.effects || [])
                .filter((incoming) => {
                    const exists = ((existingEntity && existingEntity.effects) || []).findIndex((existing) => incoming.label === existing.label) > -1;
                    return !exists;
                });

            const transaction = await database.strain.transaction();
            try {
                const statement1 = `update strain set name = ?, race_id = ? where strain_id = ?;`
                const values1 = [incomingEntity.name, incomingEntity.race_id, incomingEntity.strain_id];
                await database.strain.nonQuery(transaction, statement1, values1);

                if (flavorsToInsert.length > 0) {
                    const statement2 = `insert into strain_flavor (strain_id, label) values ?;`;
                    const values2 = [flavorsToInsert.map((flavor) => [incomingEntity.strain_id, flavor.label])];
                    await database.strain.insertQuery(transaction, statement2, values2);
                }

                if (flavorsToDelete.length > 0) {
                    let statement3 = `delete from strain_flavor where flavor_id in (`;
                    let values3: number[] = [];
                    flavorsToDelete.forEach((flavor, index) => {
                        statement3 += '?';
                        if (index !== flavorsToDelete.length - 1) statement3 += ',';
                        values3.push(flavor.flavor_id);
                    });
                    if (values3.length === 0) {
                        statement3 += '?';
                        values3.push(0);
                    }
                    statement3 = statement3 + ');';
                    await database.strain.nonQuery(transaction, statement3, values3);
                }

                if (effectsToInsert.length > 0) {
                    const statement4 = effectsToInsert.length > 0 ? `insert into strain_effect (effect_type_id, strain_id, label) values ?;` : 'select 1';
                    const values4 = [effectsToInsert.map((effect) => [effect.effect_type_id, incomingEntity.strain_id, effect.label])];
                    await database.strain.insertQuery(transaction, statement4, values4);
                }

                if (effectsToDelete.length > 0) {
                    let statement5 = `delete from strain_effect where effect_id in (`;
                    let values5: number[] = [];
                    effectsToDelete.forEach((effect, index) => {
                        statement5 += '?';
                        if (index !== effectsToDelete.length - 1) statement5 += ',';
                        values5.push(effect.effect_id);
                    });
                    if (values5.length === 0) {
                        statement5 += '?';
                        values5.push(0);
                    }
                    statement5 = statement5 + ');';
                    await database.strain.nonQuery(transaction, statement5, values5);
                }

                await database.strain.commit(transaction);
                resolve(incomingEntity.strain_id);
            }
            catch (err) {
                await database.strain.rollback(transaction);
                console.error(err);
                reject(new DatabaseError(`${this.constructor.name}Error Updating Strain Detail via transaction`, err));
            }
        }));
    }
    /**
     * Delete a Strain (and all of its Flavors and Effects) by Strain Id.
     */
    async deleteStrainById(strainId: number): Promise<void> {
        return new Promise<void>((async (resolve, reject) => {
            console.log(`${this.constructor.name}.deleteStrainById()`, strainId);

            const transaction = await database.strain.transaction();
            try {
                const statement1 = `delete from strain_flavor where strain_id = ?;`;
                const values1 = [strainId];
                await database.strain.nonQuery(transaction, statement1, values1);

                const statement2 = `delete from strain_effect where strain_id = ?;`;
                const values2 = [strainId];
                await database.strain.nonQuery(transaction, statement2, values2);

                const statement3 = `delete from strain where strain_id = ?;`;
                const values3 = [strainId];
                await database.strain.nonQuery(transaction, statement3, values3);

                await database.strain.commit(transaction);
                resolve();
            }
            catch (err) {
                await database.strain.rollback(transaction);
                console.error(err);
                reject(new DatabaseError(`${this.constructor.name}Error Deleting Strain Detail via transaction`, err));
            }
        }));
    }
    /**
     * Get a list of all strains.
     * Note: Does not return detail records.
     */
    async getStrainLitesAll(): Promise<StrainEntity[]> {
        console.log(`${this.constructor.name}.getStrainLitesAll()`);
        const pool = await database.strain.pool();
        const statement = `select * from strain;`;
        const entities = <StrainEntity[]>await database.strain.query(pool, statement);
        // console.log(entities);
        return entities;
    }
    /**
     * Get Strain Detail record by Id. Includes all Flavors and Effects.
     */
    async getStrainDetailById(strainId: number): Promise<StrainEntity | undefined> {
        console.log(`${this.constructor.name}.getStrainDetailById()`, strainId);
        const pool = await database.strain.pool();

        const statement = `select * from strain where strain_id = ?;`;
        const values = [strainId];
        const entities = <StrainEntity[]>await database.strain.query(pool, statement, values);

        if (entities.length === 0) return undefined;
        const entity = entities[0];

        const statement2 = `select * from strain_flavor where strain_id = ?`;
        const values2 = [strainId];
        entity.flavors = <StrainFlavorEntity[]>await database.strain.query(pool, statement2, values2);

        const statement3 = `select * from strain_effect where strain_id = ?`;
        const values3 = [strainId];
        entity.effects = <StrainEffectEntity[]>await database.strain.query(pool, statement3, values3);

        return entity;
    }
     /**
     * Used in Update, and possibly other things. Get a light strain record from a strainId.
     * Note: Does not return a detail record.
     */
    async getStrainLiteById(strainId: number): Promise<StrainEntity | undefined> {
        console.log(`${this.constructor.name}.getStrainLiteById()`);
        const pool = await database.strain.pool();

        let statement = `select * from strain where strain_id = ?;`;
        const values = [strainId];
        const entities = <StrainEntity[]>await database.strain.query(pool, statement, values);

        if (entities.length === 0) return undefined;
        const entity = entities[0];

        // console.log(entities);
        return entity;
    }
    /**
     * Used in Search. Get a List of light strain records from a list of Strain Ids.
     * Note: Does not return detail records.
     */
    async getStrainLitesByIds(strainIds: number[]): Promise<StrainEntity[]> {
        console.log(`${this.constructor.name}.getStrainLitesByIds()`);
        const pool = await database.strain.pool();
        let statement = `select * from strain where strain_id in (`;
        let values: number[] = [];
        strainIds.forEach((strainId, index) => {
            statement += '?';
            if (index !== strainIds.length - 1) statement += ',';
            values.push(strainId);
        });
        if (values.length === 0) values.push(0);
        statement = statement + ');';
        const entities = <StrainEntity[]>await database.strain.query(pool, statement, values);
        // console.log(entities);
        return entities;
    }
    /**
     * Get a list of all Strain Races.
     */
    async getStrainRaces(): Promise<StrainRaceEntity[]> {
        console.log(`${this.constructor.name}.getStrainRaces()`);
        const pool = await database.strain.pool();
        const statement = `select * from strain_race;`;
        const entities = <StrainRaceEntity[]>await database.strain.query(pool, statement);
        // console.log(entities);
        return entities;
    }
    /**
     * Get a list of all Strain Effect Types.
     */
    async getStrainEffectTypes(): Promise<StrainEffectTypeEntity[]> {
        console.log(`${this.constructor.name}.getStrainEffectTypes()`);
        const pool = await database.strain.pool();
        const statement = `select * from strain_effect_type;`;
        const entities = <StrainEffectTypeEntity[]>await database.strain.query(pool, statement);
        // console.log(entities);
        return entities;
    }
    /**
     * Get a list of distinct Strain Ids which matches a specific [StrainSearchModel].
     */
    async searchStrainIds(searchModel: StrainSearchModel): Promise<number[]> {
        console.log(`${this.constructor.name}.getStrainLitesAll()`);
        const pool = await database.strain.pool();
        let statement = `select distinct strn.strain_id from strain strn`;
        statement += ` inner join strain_effect efct on efct.strain_id = strn.strain_id`;
        statement += ` inner join strain_flavor flvr on flvr.strain_id = strn.strain_id`;
        const isSearching = (Object.keys(searchModel) || []).filter(key => !!searchModel[key]).length > 0;
        let values: any[] = [];
        if (isSearching) {
            statement += ' where';
            let firstWhereClauseExists = false;
            if (searchModel.searchName) {
                if (firstWhereClauseExists) statement += ` and`;
                statement += ` strn.name COLLATE UTF8_GENERAL_CI like ?`;
                values.push(`%${searchModel.searchName}%`);
                firstWhereClauseExists = true;
            }
            if (searchModel.searchFlavor) {
                if (firstWhereClauseExists) statement += ` and`;
                statement += ` flvr.label COLLATE UTF8_GENERAL_CI like ?`;
                values.push(`%${searchModel.searchFlavor}%`);
                firstWhereClauseExists = true;
            }
            if (searchModel.searchEffect) {
                if (firstWhereClauseExists) statement += ` and`;
                statement += ` efct.label COLLATE UTF8_GENERAL_CI like ?`;
                values.push(`%${searchModel.searchEffect}%`);
                firstWhereClauseExists = true;
            }
            if (searchModel.searchRaceId) {
                if (firstWhereClauseExists) statement += ` and`;
                statement += ` strn.race_id = ?`;
                values.push(searchModel.searchRaceId);
                firstWhereClauseExists = true;
            }
            if (searchModel.searchEffectTypeId) {
                if (firstWhereClauseExists) statement += ` and`;
                statement += ` efct.effect_type_id = ?`;
                values.push(searchModel.searchEffectTypeId);
                firstWhereClauseExists = true;
            }
        }
        statement += `;`;
        const entities = <StrainEntity[]>await database.strain.query(pool, statement, values);
        return entities.map((e) => e.strain_id);
    }
}


