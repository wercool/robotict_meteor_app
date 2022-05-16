import React, { useState, useCallback, useReducer, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
// import uniqid from 'uniqid';
import { ThemeContext } from '../../contexts/ThemeContext';
import { SettingsCollection } from '../../../api/settings';
import { SettingDisplay } from './SettingDisplay';
import { SettingEdit } from './SettingEdit';

export const Settings = () => {
    const display_rules_setting = useTracker(() => SettingsCollection.findOne({ name: 'display_rules' }));

    const [editedSetting, setEditedSetting] = useState(null);
    const [createdSetting, setCreatedSetting] = useState(null);
    const [, setRefershUI] = useReducer(update => update + 1, 0);

    const updateSetting = useCallback((setting) => {
        // if (!setting._id) {
        //     setting._id = uniqid();

        //     SettingsCollection.update(display_rules_setting._id, {
        //         $set: {
        //             value: [...display_rules_setting.value, setting]
        //         }
        //     });
        // } else {
        //     SettingsCollection.update(display_rules_setting._id, {
        //         $set: {
        //             value: display_rules_setting.value.map(display_rule => {
        //                 if (display_rule._id === setting._id) {
        //                     return setting;
        //                 }
        //                 return display_rule;
        //             })
        //         }
        //     });
        // }

        Meteor.call('settings.update', setting, error => {
            if (error) {
                console.error(error);
            } else {
                setEditedSetting(null);
                setCreatedSetting(null);
            }
        });

        // setEditedSetting(null);
        // setCreatedSetting(null);
    }, [editedSetting, display_rules_setting]);

    const deleteSetting = useCallback((setting) => {
        // SettingsCollection.update(display_rules_setting._id, {
        //     $set: {
        //         value: display_rules_setting.value.filter(display_rule => display_rule._id !== setting._id)
        //     }
        // });

        const updated_setting = display_rules_setting.value.filter(display_rule => display_rule._id !== setting._id);
        Meteor.call('setting.update.by._id', { _id: display_rules_setting._id, setting: updated_setting }, error => {
            if (error) {
                console.error(error);
            } else {
                setRefershUI();
            }
        });

        // setRefershUI();
    }, [editedSetting, display_rules_setting]);

    useEffect(() => setCreatedSetting(null), [editedSetting]);
    useEffect(() => setEditedSetting(null), [createdSetting]);

    return (
        <ThemeContext.Consumer>
            {theme => (
                <div
                    className="flex_vertical"
                >
                    <h3>Display rules</h3>
                    <span style={{ fontSize: "0.75rem", fontStyle: "italic" }}>rules are applied in display order</span>
                    <br/>
                    {display_rules_setting
                    && Array.isArray(display_rules_setting.value) 
                    && display_rules_setting.value.map((setting, idx) => (
                        <div
                            className="flex_vertical"
                            key={`setting_${idx}`}
                        >
                            <div
                                className={[
                                    "flex_horizontal",
                                    "noselect",
                                    "settings_entry",
                                    (editedSetting && editedSetting._id !== setting._id) && "muted"
                                ].filter(Boolean).join(' ')}
                            >
                                {!editedSetting || (editedSetting && editedSetting._id !== setting._id)
                                    ?
                                        <SettingDisplay
                                            setting={setting}
                                            setEditedSetting={setEditedSetting}
                                            deleteSetting={deleteSetting}
                                        />
                                    :
                                        <SettingEdit
                                            editedSetting={editedSetting}
                                            updateSetting={updateSetting}
                                        />
                                }
                            </div>
                            <hr/>
                        </div>
                    ))}


                    {/* add new rule section */}
                    <br/>
                    {createdSetting &&
                        <SettingEdit
                            editedSetting={createdSetting}
                            updateSetting={updateSetting}
                            classes={['settings_entry']}
                        />
                    }

                    {!createdSetting &&
                        <div
                            className="flex_horizontal"
                        >
                            <div className="flex_expander"></div>
                            <button
                                onClick={_ => setCreatedSetting({
                                    sub: 'SUB',
                                    cond: []
                                })}
                                style={{ fontSize: "1.2rem" }}
                            >
                                ＋
                            </button>
                        </div>
                    }
                </div>
            )}
        </ThemeContext.Consumer>
    );
};
