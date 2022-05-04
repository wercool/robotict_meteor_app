import React, { useState, useCallback, useReducer, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ThemeContext } from '../../contexts/ThemeContext';
import { SettingsCollection } from '../../../api/settings';
import { SettingDisplay } from './SettingDisplay';
import { SettingEdit } from './SettingEdit';

export const Settings = () => {
    const settings = useTracker(() => SettingsCollection.find({}).fetch());

    const [editedSetting, setEditedSetting] = useState(null);
    const [createdSetting, setCreatedSetting] = useState(null);
    const [, setRefershUI] = useReducer(update => update + 1, 0);

    const updateSetting = useCallback((setting) => {
        if (setting._id) {
            SettingsCollection.update(setting._id, { $set: { ...setting } });
        } else {
            SettingsCollection.insert(setting);
        }

        setEditedSetting(null);
        setCreatedSetting(null);
    }, [editedSetting]);

    const deleteSetting = useCallback((setting) => {
        SettingsCollection.remove(setting._id);
        setRefershUI();
    }, [editedSetting]);

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
                    {settings.map((setting, idx) => (
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
