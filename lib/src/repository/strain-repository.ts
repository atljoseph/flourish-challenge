
import * as config from 'config';

import { MysqlDatabaseConfig, MysqlDatabase } from '../database/mysql-database';
import { StrainFlavorEntity, StrainEffectTypeEntity, StrainEntity, StrainRaceEntity, StrainEffectEntity } from '../entity';
import { asyncForEach } from '../util';
import { DatabaseError } from '../error';

// this should ideally have another layer of abstraction between the database and business
// in interest of brevity, i left them together here
// should ideally use transactions, also ...

export class StrainRepository {
    // throwing error hear will bubble up to route or controller
    private db: MysqlDatabase;
    constructor(db_config: MysqlDatabaseConfig) {
        this.db = new MysqlDatabase(db_config);
    }
    async createStrain(entity: StrainEntity, isIdentityInsert?: boolean): Promise<number> {
        console.log(`${this.constructor.name}.createStrain()`, entity);
        // ideally, this would be a transaction !!
        const strainValues: any[] = [];
        if (isIdentityInsert) {
            strainValues.push(entity.strain_id);
        }
        strainValues.push(entity.name);
        strainValues.push(entity.race_id);
        const strainStatement = `insert into strain (${isIdentityInsert ? 'strain_id, ' : ''}name, race_id) values (${isIdentityInsert ? '?, ' : ''}?, ?);`;
        const newStrainId = await this.db.insertQuery(strainStatement, strainValues);
        console.log(`${this.constructor.name}.createStrain()`, newStrainId);
        await asyncForEach(entity.flavors, async (flavor: StrainFlavorEntity) => {
            await this.db.nonQuery(
                `insert into strain_flavor (strain_id, label) values (?, ?);`,
                [newStrainId, flavor.label]
            );
        });
        await asyncForEach(entity.effects, async (effect: StrainEffectEntity) => {
            await this.db.nonQuery(
                `insert into strain_effect (effect_type_id, strain_id, label) values (?, ?, ?);`,
                [effect.effect_type_id, newStrainId, effect.label]
            );
        });
        return newStrainId;
    }
    async updateStrain(strain: StrainEntity): Promise<number> {
        console.log(`${this.constructor.name}.updateStrain()`, strain);
        // not implemented yet
        return 2;
    }
    async deleteStrainById(strainId: number): Promise<boolean> {
        console.log(`${this.constructor.name}.deleteStrainById()`, strainId);
        await this.db.nonQuery(`delete from strain_flavor where strain_id = ?;`, [strainId]);
        await this.db.nonQuery(`delete from strain_effect where strain_id = ?;`, [strainId]);
        await this.db.nonQuery(`delete from strain where strain_id = ?;`, [strainId]);
        return true;
    }
    async getAllStrains(): Promise<StrainEntity[]> {
        console.log(`${this.constructor.name}.getAllStrains()`);
        const statement = `select * from strain;`;
        const entities = <StrainEntity[]>await this.db.query(statement);
        // console.log(entities);
        return entities;
    }
    async getStrainDetailById(strainId: number): Promise<StrainEntity | undefined> {
        console.log(`${this.constructor.name}.getStrainById()`, strainId);
        const statement = `select * from strain where strain_id = ?;`;
        const values = [strainId];
        const entities = <StrainEntity[]>await this.db.query(statement, values);
        if (entities.length === 0) return undefined;
        // console.log(entities);
        const entity = entities[0];
        entity.flavors = await this.getStrainFlavorsByStrainId(strainId);
        entity.effects = await this.getStrainEffectsByStrainId(strainId);
        return entity;
    }
    async getStrainsByIds(strainIds: number[]): Promise<StrainEntity[]> {
        console.log(`${this.constructor.name}.getStrainsByIds()`);
        let statement = `select * from strain where strainId in (`;
        let values: number[] = [];
        strainIds.forEach((strainId, index) => {
            statement += '?';
            if (index !== strainIds.length - 1) statement += ',';
            values.push(strainId);
        });
        statement = statement + ');';
        const entities = <StrainEntity[]>await this.db.query(statement, values);
        // console.log(entities);
        return entities;
    }
    async getStrainRaces(): Promise<StrainRaceEntity[]> {
        console.log(`${this.constructor.name}.getStrainRaces()`);
        const statement = `select * from strain_race;`;
        const entities = <StrainRaceEntity[]>await this.db.query(statement);
        // console.log(entities);
        return entities;
    }
    async getStrainFlavorsByStrainId(strainId: number): Promise<StrainFlavorEntity[]> {
        console.log(`${this.constructor.name}.getStrainFlavors()`);
        const statement = `select * from strain_flavor where strain_id = ?`;
        const values = [strainId];
        const entities = <StrainFlavorEntity[]>await this.db.query(statement, values);
        // console.log(entities);
        return entities;
    }
    async getStrainEffectsByStrainId(strainId: number): Promise<StrainEffectEntity[]> {
        console.log(`${this.constructor.name}.getStrainFlavors()`);
        const statement = `select * from strain_effect where strain_id = ?`;
        const values = [strainId];
        const entities = <StrainEffectEntity[]>await this.db.query(statement, values);
        // console.log(entities);
        return entities;
    }
    async getStrainEffectTypes(): Promise<StrainEffectTypeEntity[]> {
        console.log(`${this.constructor.name}.getStrainEffectTypes()`);
        const statement = `select * from strain_effect_type;`;
        const entities = <StrainEffectTypeEntity[]>await this.db.query(statement);
        // console.log(entities);
        return entities;
    }
    async searchStrains(searchContext: any): Promise<StrainEntity[]> {
        console.log(`${this.constructor.name}.searchStrains()`, searchContext);
        return [];
    }
}

