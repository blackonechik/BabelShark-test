import { Meteor } from "meteor/meteor";
import { DataSource } from "typeorm";
import {
  TRANSLATE_POSITION_METHOD,
  type TranslatePositionParams,
  TranslationEntity,
} from "@/features/translate-positions";
import { getTypeOrmOptions } from "../model/mysql";

let appDataSourcePromise: Promise<DataSource | null> | null = null;

const getAppDataSource = async (): Promise<DataSource | null> => {
  if (!appDataSourcePromise) {
    appDataSourcePromise = (async () => {
      const options = getTypeOrmOptions();

      if (!options) {
        return null;
      }

      const dataSource = new DataSource({
        ...options,
        entities: [TranslationEntity],
      });

      await dataSource.initialize();
      TranslationEntity.useDataSource(dataSource);

      return dataSource;
    })();
  }

  return appDataSourcePromise;
};

export const registerTranslatePositionMethod = (): void => {
  Meteor.methods({
    async [TRANSLATE_POSITION_METHOD](
      params: TranslatePositionParams,
    ): Promise<string> {
      const normalizedText = params.text.trim();

      if (!normalizedText) {
        throw new Meteor.Error(
          "validation-error",
          "Text for translation must not be empty.",
        );
      }

      const dataSource = await getAppDataSource();

      if (!dataSource) {
        return normalizedText;
      }

      const translation = await TranslationEntity.findOne({
        where: { sourceText: normalizedText },
      });

      return translation?.translatedText ?? normalizedText;
    },
  });
};
