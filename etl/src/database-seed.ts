
import * as fs from 'fs-extra';
import * as path from 'path';

import { StrainEntity, StrainFlavorEntity, StrainEffectEntity } from 'lib';
import { asyncForEach } from 'lib';
import { EtlStrain, EtlStrainEffects } from './etl-strain';
import { StrainBusiness } from 'lib';

const strainBusiness = new StrainBusiness();

// trigger database seeding actions
export const seedDatabase = async () => {
    console.log('//////////////////////////////////');
    console.log('SEED DATABASE');
    console.log('//////////////////////////////////');
    const etlStrains = await getEtlStrainData();
    const strainEntities = await mapEtlStrainsToStrainEntities(etlStrains);
    // console.log(strainEntities);
    await asyncForEach(strainEntities, async (strainEntity) => {
        console.log(`ETL STRAIN - ${strainEntity.name}`);
        await strainBusiness.createStrain(strainEntity, true);        
    });
    // await insertTestData();
};

// get strains from json file
const getEtlStrainData = async (): Promise<EtlStrain[]> => {
    console.log('READ SEED FILE');
    const filePath = path.resolve('seed-data', 'strains.json');
    const etlStrains = <EtlStrain[]>await fs.readJSON(filePath);
    return etlStrains;
}

// map etlStrain objects to strainEntity objects
const mapEtlStrainsToStrainEntities = async (etlStrains: EtlStrain[]): Promise<StrainEntity[]> => {
    const strainEntities: StrainEntity[] = [];
    const races = await strainBusiness.getStrainRaces();
    const effectTypes = await strainBusiness.getStrainEffectTypes();
    // await asyncForEach(etlStrains, async (etlStrain: EtlStrain) => {
    etlStrains.forEach((etlStrain) => {
        const race = races.find((race) => race.code.toLowerCase() === etlStrain.race.toLowerCase());
        if (race) {
            const entity = new StrainEntity();
            entity.strain_id = etlStrain.id;
            entity.name = etlStrain.name;
            entity.race = race;
            entity.race_id = race.race_id;
            entity.flavors = (etlStrain.flavors || []).map((etlFavor) => {
                const flavor = new StrainFlavorEntity();
                flavor.label = etlFavor;
                flavor.flavor_id = 0;
                flavor.strain_id = etlStrain.id;
                return flavor;
            });
            const effectTypePositive = effectTypes.find(effectType => effectType.code.toLowerCase() === ('positive').toLowerCase());
            if (effectTypePositive) {
                entity.effects = (etlStrain.effects.positive || []).map((etlEffect) => {
                    const effect = new StrainEffectEntity();
                    effect.label = etlEffect;
                    effect.effect_id = 0;
                    effect.effect_id = effectTypePositive.effect_type_id;
                    return effect;
                });
            }
            const effectTypeNegative = effectTypes.find(effectType => effectType.code.toLowerCase() === ('negative').toLowerCase());
            if (effectTypeNegative) {
                entity.effects = (etlStrain.effects.positive || []).map((etlEffect) => {
                    const effect = new StrainEffectEntity();
                    effect.label = etlEffect;
                    effect.effect_id = 0;
                    effect.effect_id = effectTypeNegative.effect_type_id;
                    return effect;
                });
            }
            const effectTypeMedical = effectTypes.find(effectType => effectType.code.toLowerCase() === ('medical').toLowerCase());
            if (effectTypeMedical) {
                entity.effects = (etlStrain.effects.positive || []).map((etlEffect) => {
                    const effect = new StrainEffectEntity();
                    effect.label = etlEffect;
                    effect.effect_id = 0;
                    effect.effect_id = effectTypeMedical.effect_type_id;
                    return effect;
                });
            }
            strainEntities.push(entity);
        }
        // else mark for error
    });
    return strainEntities;
}
