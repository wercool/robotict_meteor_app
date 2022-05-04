import React, { useState } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { SimpleDropDown } from '../../elements/SimpleDropDown';

export const SettingEdit = ({
    editedSetting,
    updateSetting,
    classes = []
}) => {
    const [setting, setSetting] = useState(editedSetting);
    const [newCondValue, setNewCondValue] = useState(2);
    const [newCondOperator, setNewCondOperator] = useState();

    return (
        <ThemeContext.Consumer>
            {theme => (
                <div className={[
                    "flex_horizontal",
                    "full_width",
                    ...classes
                ].join(' ')}>
                    <input
                        value={setting.sub}
                        onChange={event => setSetting({
                            ...setting,
                            sub: event.target.value
                        })}
                        style={{ maxWidth: '20%' }}
                    />
                    <span>when the number is divisible without a remainder</span>
                    <div
                        className="flex_horizontal"
                    >
                        {setting.cond.map((cond, idx) => (
                            <div
                                key={`cond${idx}`}
                            >
                                {cond.op &&
                                    <>&nbsp;<b>{cond.op}&nbsp;</b></>
                                }
                                <i>by</i>
                                &nbsp;
                                <input
                                    type="number"
                                    min="2"
                                    max="100"
                                    step="0.1"
                                    value={cond.value}
                                    onChange={event => {
                                        cond.value = Number(event.target.value);
                                        setSetting({ ...setting });
                                    }}
                                />
                            </div>
                        ))}
                        {editedSetting && !editedSetting._id &&
                            <div
                                className="flex_horizontal rule"
                            >
                                {setting.cond.length > 0 &&
                                    <SimpleDropDown
                                        items={[
                                            { label: '&', value: '&' },
                                            { label: '|', value: '|' }
                                        ]}
                                        onChange={event => setNewCondOperator(event.target.value)}
                                        style={theme.select && theme.select.generic || {}}
                                    />
                                }
                                &nbsp;
                                <input
                                    type="number"
                                    min="2"
                                    max="100"
                                    step="0.1"
                                    value={newCondValue}
                                    onChange={event => { setNewCondValue(Number(event.target.value)) }}
                                />
                                &nbsp;
                                <button
                                    onClick={_ => {
                                        const cond = {
                                            value: newCondValue
                                        };
                                        if (newCondOperator) {
                                            cond.op =  newCondOperator;
                                        }
                                        setting.cond.push(cond);
                                        setSetting({ ...setting });
                                        setNewCondValue(2);
                                        setNewCondOperator('&');
                                    }}
                                    style={{ fontSize: "1.0rem" }}
                                >
                                    ✓
                                </button>
                            </div>
                        }
                    </div>
                    <div className="flex_expander"></div>
                    <button
                        onClick={_ => updateSetting(setting)}
                        style={{ fontSize: "1.2rem" }}
                        className={[
                            (!setting.sub || setting.cond.length === 0) && 'muted'
                        ].filter(Boolean).join(' ')}
                    >
                        ✔
                    </button>
                </div>
            )}
        </ThemeContext.Consumer>
    );
};
