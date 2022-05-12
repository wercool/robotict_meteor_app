import { Meteor } from 'meteor/meteor';
import { loadThemesFromJSON } from '/imports/api/themes';
import { loadSettingsFromJSON } from '../imports/api/settings';

Meteor.startup(() => {
    //set arg to true to replace with collection from themes.json
    loadThemesFromJSON(false);
    //set arg to true to replace with collection from settings.json
    loadSettingsFromJSON(false);
});
