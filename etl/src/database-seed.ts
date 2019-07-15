
import * as fs from 'fs-extra';
import * as path from 'path';
import * as config from 'config';

import { database, DatabaseConfig } from 'lib';
import { asyncForEach } from 'lib';
import { EtlStrain, EtlStrainEffects } from './etl-strain';
import { StrainRaceEntity, StrainEffectTypeEntity } from 'lib';
const db_config = <DatabaseConfig>config.get('database');

export const seedDatabase = async () => {
    console.log('//////////////////////////////////');
    console.log('SEED DATABASE');
    console.log('//////////////////////////////////');
    // await insertTestData();
    const races = await getStrainRaces();
    const effectTypes = await getStrainEffectTypes();
    await insertStrains(races, effectTypes);
};

const getStrainData = async (): Promise<EtlStrain[]> => {
    console.log('READ SEED FILE');
    const filePath = path.resolve('seed-data', 'strains.json');
    const etlStrains = <EtlStrain[]> await fs.readJSON(filePath);
    return etlStrains;
}

const getStrainRaces = async (): Promise<StrainRaceEntity[]> => {
    console.log('GET RACES');
    const races = <StrainRaceEntity[]> await database.query(db_config, 'select * from strain_race;');
    // console.log(races);
    return races;
}

const getStrainEffectTypes = async (): Promise<StrainEffectTypeEntity[]> => {
    console.log('GET EFFECT TYPES');
    const types = <StrainEffectTypeEntity[]> await database.query(db_config, 'select * from strain_effect_type;');
    // console.log(types);
    return types;
}

const insertTestData = async () => {
    console.log('INSERT TEST DATA');
    await database.nonQuery(db_config, `insert into testy (test_name) values ('derka');`);
    await database.nonQuery(db_config, `insert into testy (test_name) values ('derk');`);
    await database.query(db_config, 'select * from testy;');
}

const insertStrains = async (races: StrainRaceEntity, effectTypes: StrainEffectTypeEntity[]) => {
    const strains = await getStrainData();
    await asyncForEach(strains, async (strain) => {
        const race = races.find((race) => {
            return race.code.toLowerCase() === strain.race.toLowerCase();
        });
        await insertStrain(strain, race, effectTypes);
    });
    await database.query(db_config, 'select count(*) from strain;');
    await database.query(db_config, 'select count(*) from strain_flavor;');
    await database.query(db_config, 'select count(*) from strain_effect');
}

const insertEffects = async (strain: EtlStrain, strainEffectCollection: string[], effectType: StrainEffectTypeEntity) => {
    await asyncForEach(strainEffectCollection, async (effect) => {
        // console.log(strainEffectCollection);
        // console.log(effectType);
        await database.nonQuery(db_config, 
            `insert into strain_effect (effect_type_id, strain_id, label) values (?, ?, ?);`,
            [effectType.effect_type_id, strain.id, effect]
        );
    });
}

const insertStrain = async (strain: EtlStrain, race: StrainRaceEntity, effectTypes: StrainEffectTypeEntity[]) => {
    try {
        console.log(`INSERT STRAIN DATA - ${strain.name}`);
        await database.nonQuery(db_config, 
            `insert into strain (strain_id, name, race_id) values (?, ?, ?);`,
            [strain.id, strain.name, race.race_id]
        );
        await asyncForEach(strain.flavors, async (flavor) => {
            await database.nonQuery(db_config,  
                `insert into strain_flavor (strain_id, label) values (?, ?);`,
                [strain.id, flavor]
            );
        });
        await insertEffects(strain, strain.effects.positive, effectTypes.find(effectType => effectType.code.toLowerCase() === ('positive').toLowerCase()));
        await insertEffects(strain, strain.effects.negative, effectTypes.find(effectType => effectType.code.toLowerCase() === ('negative').toLowerCase()));
        await insertEffects(strain, strain.effects.medical, effectTypes.find(effectType => effectType.code.toLowerCase() === ('medical').toLowerCase()));
    }
    catch (err) {
        console.log('STRAIN INSERT ERROR');
        console.error(err);
    }
}
