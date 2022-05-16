import { Meteor } from 'meteor/meteor';
import uniqid from 'uniqid';
import { SettingsCollection } from './settings';

Meteor.methods({
    'settings.update': (setting) => {
        const display_rules_setting = SettingsCollection.findOne({ name: 'display_rules' });
        // console.log(display_rules_setting, setting);

        if (!setting._id) {
            setting._id = uniqid();

            return SettingsCollection.update(display_rules_setting._id, {
                $set: {
                    value: [...display_rules_setting.value, setting]
                }
            });
        } else {
            return SettingsCollection.update(display_rules_setting._id, {
                $set: {
                    value: display_rules_setting.value.map(display_rule => {
                        if (display_rule._id === setting._id) {
                            return setting;
                        }
                        return display_rule;
                    })
                }
            });
        }
    },
    'setting.update.by._id': ({ _id, setting }) => {
        return SettingsCollection.update(_id, {
            $set: {
                value: setting
            }
        });
    }
});