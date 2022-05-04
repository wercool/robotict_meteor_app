import { Mongo } from 'meteor/mongo';

export const SettingsCollection = new Mongo.Collection('settings');

/**
 * Prepare settings collection persist to Mongo from local JSON
 * @param {*} replace set to true to reload from local JSON file
 */
export const loadSettingsFromJSON = (replace = false) => {
    if (replace) {
        SettingsCollection.remove({});
    }

    if (SettingsCollection.find({}).count() === 0) {
        console.log("Importing assets/settings.json to db");
        const settings = JSON.parse(Assets.getText('assets/settings.json'));
        console.log('Settings:', settings);
        settings.forEach(setting => SettingsCollection.insert(setting));
        console.log(`${SettingsCollection.find({}).count()} settings inserted`);
    }
}
