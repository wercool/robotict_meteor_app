import { Mongo } from 'meteor/mongo';

export const ThemesCollection = new Mongo.Collection('themes');

/**
 * Prepare themes collection persist to Mongo from local JSON
 * @param {*} replace set to true to reload from local JSON file
 */
export const loadThemesFromJSON = (replace = false) => {
    if (replace) {
        ThemesCollection.remove({});
    }

    if (ThemesCollection.find({}).count() === 0) {
        console.log("Importing assets/themes.json to db");
        const themes = JSON.parse(Assets.getText('assets/themes.json'));
        themes.forEach(theme => ThemesCollection.insert(theme));
        console.log(`${ThemesCollection.find({}).count()} themes inserted`);
    }
}
