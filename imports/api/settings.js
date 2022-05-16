import { Mongo } from 'meteor/mongo';
import uniqid from 'uniqid';

export const SettingsCollection = new Mongo.Collection('settings');

SettingsCollection.allow({
    insert: (userId, doc) => true,
    update: (userId, doc, fieldNames, modifier) => true,
    remove: (userId, doc) => true
});

/**
 * Prepare settings collection persist to Mongo from local JSON
 * @param {*} replace set to true to reload from local JSON file
 */
export const loadSettingsFromJSON = (replace = false) => {
    if (replace) {
        SettingsCollection.remove({});
    }

    if (SettingsCollection.find({ name: 'display_rules' }).count() === 0) {
        SettingsCollection.remove({});
        console.log("Importing assets/settings.json to db");
        const settings = JSON.parse(Assets.getText('assets/settings.json'));

        //generate _id(s) for inner 'display_rules' setting object
        const display_rules_seeting_entry = settings.find(setting => setting.name === 'display_rules');
        if (display_rules_seeting_entry && display_rules_seeting_entry.value) {
            display_rules_seeting_entry.value.forEach(display_rule => display_rule._id = uniqid());
        }

        console.log('Settings:', settings);
        settings.forEach(setting => SettingsCollection.insert(setting));
        console.log(`${SettingsCollection.find({}).count()} settings inserted`);
    }
}
