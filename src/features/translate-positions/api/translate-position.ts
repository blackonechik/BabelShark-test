import { Meteor } from "meteor/meteor";
import { TRANSLATE_POSITION_METHOD } from "./contracts";

export const translatePosition = (text: string): Promise<string> =>
  new Promise((resolve, reject) => {
    Meteor.call(
      TRANSLATE_POSITION_METHOD,
      { text },
      (error: Meteor.Error | null, result: string | undefined) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result ?? text);
      },
    );
  });
