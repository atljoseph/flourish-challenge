
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
    
    await asyncForEach(etlStrains, async (etlStrains) => {
        console.log(`ETL CREATE STRAIN - ${etlStrains.name}`, etlStrains);
        await strainBusiness.createStrainDetailFromEtl(etlStrains, true);
    });
    // await insertTestData();
};

// get strains from json file
const getEtlStrainData = async (): Promise<StrainEtlModel[]> => {
    console.log('READ SEED FILE');
    const filePath = path.resolve('seed-data', 'strains.json');
    const etlStrains = <StrainEtlModel[]>await fs.readJSON(filePath);
    return etlStrains;
}
