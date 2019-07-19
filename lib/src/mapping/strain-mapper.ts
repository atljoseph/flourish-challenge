import { StrainDto, StrainFlavorDto, StrainRaceDto, StrainEffectDto, StrainEffectsDto } from "../dto";
import { StrainFlavorEntity, StrainEntity, StrainRaceEntity, StrainEffectTypeEntity } from "../entity";
import { StrainEtlModel } from "../model/strain-etl.model";

class StrainMapper {
    // map etlStrain objects to strainDto objects
    mapEtlToStrainDto(etl: StrainEtlModel, races: StrainRaceEntity[], effectTypes: StrainEffectTypeEntity[]): StrainDto {
        console.log(effectTypes);
        const race = <StrainRaceDto>races.find((race) => race.code.toLowerCase() === etl.race.toLowerCase());
        const dto = new StrainDto();
        dto.strain_id = etl.id;
        dto.name = etl.name;
        dto.race = race;
        dto.race_id = race.race_id;
        dto.flavors = (etl.flavors || []).map((etlFavor) => {
            const flavor = new StrainFlavorEntity();
            flavor.flavor_id = 0;
            flavor.strain_id = etl.id;
            flavor.label = etlFavor;
            return flavor;
        });
        dto.effects = new StrainEffectsDto();
        effectTypes.forEach(effectType => {
            dto.effects[effectType.code] = etl.effects[effectType.code] // string[]
                .map(etlEffectString => {
                    const effect = new StrainEffectDto();
                    effect.effect_id = 0;
                    effect.strain_id = etl.id;
                    effect.label = etlEffectString;
                    effect.effect_type_id = effectType.effect_type_id;
                    effect.effect_type = effectType;
                    return effect;
                });
        });
        return dto;
    }
    // map entity to dto
    mapToStrainDto(entity: StrainEntity, races: StrainRaceEntity[], effectTypes: StrainEffectTypeEntity[], mapDetail: boolean = false): StrainDto {
        const dto = new StrainDto();
        dto.name = entity.name;
        dto.strain_id = entity.strain_id;
        dto.race_id = entity.race_id;
        dto.race = <StrainRaceDto>races.find((race) => race.race_id === entity.race_id);
        if (mapDetail) {
            dto.flavors = (entity.flavors || []).map((entityFlavor) => <StrainFlavorDto>entityFlavor);
            dto.effects = new StrainEffectsDto();
            effectTypes.forEach(effectType => {
                dto.effects[effectType.code] = (entity.effects || [])
                    .filter(entityEffect => entityEffect.effect_type_id === effectType.effect_type_id)
                    .map(entityEffect => <StrainEffectDto>entityEffect);
            });
        }
        return dto;
    }
    // map dto to entity
    mapToStrainEntity(dto: StrainDto): StrainEntity {
        console.log(dto);
        const entity = new StrainEntity();
        entity.name = dto.name;
        entity.strain_id = dto.strain_id;
        entity.race_id = dto.race ? dto.race.race_id : dto.race_id;
        entity.flavors = (dto.flavors || []).map((dtoFlavor) => <StrainFlavorEntity>dtoFlavor);
        entity.effects = (dto.effects.positive || [])
            .concat(dto.effects.negative || [])
            .concat(dto.effects.medical || []);
        return entity;
    }
}

export let strainMapper = new StrainMapper();
