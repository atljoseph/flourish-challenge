
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
            console.log(`${this.constructor.name}.createStrainDetail()`, entity);
            const values1: any[] = [];
            if (isIdentityInsert) {
                values1.push(entity.strain_id);
            }
            values1.push(entity.name);
            values1.push(entity.race_id);

            let newStrainId = 0;
            const transaction = await database.strain.transaction();

            const statement1 = `insert into strain (${isIdentityInsert ? 'strain_id, ' : ''}name, race_id) values (${isIdentityInsert ? '?, ' : ''}?, ?);`;
            await transaction.query(statement1, values1, async (err1, rows1, fields1) => {
                if (err1) {
                    await database.strain.rollback(transaction);
                    reject(new DatabaseError(`${this.constructor.name}Error Inserting Strain`, err1));
                }
                newStrainId = rows1.insertId;
                const statement2 = entity.flavors.length > 0 ? `insert into strain_flavor (strain_id, label) values ?;` : 'select 1';
                const values2 = [entity.flavors.map((flavor) => [newStrainId, flavor.label])];
                // console.log(`${this.constructor.name} - New Strain ID: ${newStrainId}`, statement2, values2);
                await transaction.query(statement2, values2, async (err2, rows2, fields2) => {
                    if (err2 && err2! instanceof DatabaseError) {
                        console.error(err2);
                        await database.strain.rollback(transaction);
                        reject(new DatabaseError(`${this.constructor.name}Error Inserting Strain Flavors(s)`, err2));
                    }
                    const statement3 = entity.effects.length > 0 ? `insert into strain_effect (effect_type_id, strain_id, label) values ?;` : 'select 1';
                    const values3 = [entity.effects.map((effect) => [effect.effect_type_id, newStrainId, effect.label])];
                    await transaction.query(statement3, values3, async (err3, rows3, fields3) => {
                        if (err3) {
                            console.error(err3);
                            await database.strain.rollback(transaction);
                            reject(new DatabaseError(`${this.constructor.name}Error Inserting Strain Effect(s)`, err3));
                        }
                        await database.strain.commit(transaction);
                        resolve(newStrainId);
                    });
                });
            });
        }));
    }
    /**
     * Update Strain Detail from an entity object.
     * For Flavors and Effects, this will delete and replace any records that changed.
     */
    async updateStrainDetail(entity: StrainEntity): Promise<number> {
        return new Promise<number>((async (resolve, reject) => {
            console.log(`${this.constructor.name}.updateStrainDetail()`, entity);

            const existingStrain = await this.getStrainDetailById(entity.strain_id);

            const flavorsToDelete = ((existingStrain && existingStrain.flavors) || [])
                .filter((existing) => {
                    const exists = (entity.flavors || []).findIndex((incoming) => existing.label === incoming.label) > -1;
                    return !exists;
                });
            const flavorsToInsert = (entity.flavors || [])
                .filter((incoming) => {
                    const exists = ((existingStrain && existingStrain.flavors) || []).findIndex((existing) => incoming.label === existing.label) > -1;
                    return !exists;
                });

            const effectsToDelete = ((existingStrain && existingStrain.effects) || [])
                .filter((existing) => {
                    const exists = (entity.effects || []).findIndex((incoming) => existing.label === incoming.label) > -1;
                    return !exists;
                });
            const effectsToInsert = (entity.effects || [])
                .filter((incoming) => {
                    const exists = ((existingStrain && existingStrain.effects) || []).findIndex((existing) => incoming.label === existing.label) > -1;
                    return !exists;
                });

            const transaction = await database.strain.transaction();
            const statement1 = `update strain set name = ?, race_id = ? where strain_id = ?;`
            const values1 = [entity.name, entity.race_id, entity.strain_id];
            await transaction.query(statement1, values1, async (err1, rows1, fields1) => {
                if (err1) {
                    console.error(err1);
                    await database.strain.rollback(transaction);
                    reject(new DatabaseError(`${this.constructor.name}Error Updating Strain`, err1));
                }

                const statement2 = flavorsToInsert.length > 0 ? `insert into strain_flavor (strain_id, label) values ?;` : 'select 1';
                const values2 = [flavorsToInsert.map((flavor) => [entity.strain_id, flavor.label])];
                await transaction.query(statement2, values2, async (err2, rows2, fields2) => {
                    if (err2) {
                        console.error(err2);
                        await database.strain.rollback(transaction);
                        reject(new DatabaseError(`${this.constructor.name}Error Inserting Strain Flavors(s)`, err2));
                    }

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
                    await transaction.query(statement3, values3, async (err3, rows3, fields3) => {
                        if (err3) {
                            console.error(err3);
                            await database.strain.rollback(transaction);
                            reject(new DatabaseError(`${this.constructor.name}Error Deleting Strain Flavor(s)`, err3));
                        }

                        const statement4 = effectsToInsert.length > 0 ? `insert into strain_effect (effect_type_id, strain_id, label) values ?;` : 'select 1';
                        const values4 = [effectsToInsert.map((effect) => [effect.effect_type_id, entity.strain_id, effect.label])];
                        await transaction.query(statement4, values4, async (err4, rows4, fields4) => {
                            if (err4) {
                                console.error(err4);
                                await database.strain.rollback(transaction);
                                reject(new DatabaseError(`${this.constructor.name}Error Inserting Strain Effects(s)`, err4));
                            }

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
                            await transaction.query(statement5, values5, async (err5, rows5, fields5) => {
                                if (err5) {
                                    console.error(err5);
                                    await database.strain.rollback(transaction);
                                    reject(new DatabaseError(`${this.constructor.name}Error Deleting Strain Effects(s)`, err5));
                                }

                                await database.strain.commit(transaction);
                                resolve(entity.strain_id);
                            });
                        });
                    });
                });
            });
        }));
    }
    /**
     * Delete a Strain (and all of its Flavors and Effects) by Strain Id.
     */
    async deleteStrainById(strainId: number): Promise<void> {
        return new Promise<void>((async (resolve, reject) => {
            console.log(`${this.constructor.name}.deleteStrainById()`, strainId);
            const transaction = await database.strain.transaction();
            await transaction.query(`delete from strain_flavor where strain_id = ?;`, [strainId], async (err1, rows1, fields1) => {
                if (err1) {
                    console.error(err1);
                    await database.strain.rollback(transaction);
                    reject(new DatabaseError(`${this.constructor.name}Error Deleting Strain Flavor(s)`, err1));
                }
                await transaction.query(`delete from strain_effect where strain_id = ?;`, [strainId], async (err2, rows2, fields2) => {
                    if (err2) {
                        console.error(err2);
                        await database.strain.rollback(transaction);
                        reject(new DatabaseError(`${this.constructor.name}Error Deleting Strain Effect(s)`, err2));
                    }
                    await transaction.query(`delete from strain where strain_id = ?;`, [strainId], async (err3, rows3, fields3) => {
                        if (err3) {
                            await database.strain.rollback(transaction);
                            reject(new DatabaseError(`${this.constructor.name}Error Deleting Strain By Id`, err3));
                        }
                        resolve(await database.strain.commit(transaction));
                    });
                });
            });
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


