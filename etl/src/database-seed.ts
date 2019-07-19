
import * as fs from 'fs-extra';
import * as path from 'path';

import { asyncForEach } from 'lib';
import { StrainEtlModel } from 'lib';
import { StrainBusiness } from 'lib';

const strainBusiness = new StrainBusiness();

// trigger database seeding actions
export const seedDatabase = async () => {
    console.log('//////////////////////////////////');
    console.log('SEED DATABASE');
    console.log('//////////////////////////////////');
    const etlStrains = await getEtlStrainData();
    
    await asyncForEach(etlStrains, async (etlStrain) => {
        console.log(`ETL CREATE STRAIN - ${etlStrain.name}`, etlStrain);
        await strainBusiness.createStrainDetailFromEtl(etlStrain, true);
    });
};

// get strains from json file
const getEtlStrainData = async (): Promise<StrainEtlModel[]> => {
    console.log('READ SEED FILE');
    const filePath = path.resolve('seed-data', 'strains.json');
    const etlStrains = <StrainEtlModel[]>await fs.readJSON(filePath);
    return etlStrains;
}
