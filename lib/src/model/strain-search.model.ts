export class StrainSearchModel {
    searchName: string;
    searchRace: string;
    searchFlavor: string;
    searchEffect: string;
    searchEffectType: string;
    // calced on server
    searchRaceId: number = 0;
    searchEffectTypeId: number = 0;
}