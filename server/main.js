import { Meteor } from 'meteor/meteor';
import { loadThemesFromJSON } from '/imports/api/themes';
import { loadSettingsFromJSON } from '../imports/api/settings';

Meteor.startup(() => {
    loadThemesFromJSON(true);
    loadSettingsFromJSON(false);
});
