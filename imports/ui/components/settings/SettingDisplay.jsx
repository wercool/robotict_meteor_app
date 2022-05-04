import React from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

export const SettingDisplay = ({
    setting,
    setEditedSetting,
    deleteSetting
}) => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <>
                    <h4>"<i>{setting.sub}</i>"</h4>
                    <span>when the number is divisible without a remainder</span>
                    {setting.cond.map((cond, idx) => (
                        <div
                            key={`cond${idx}`}
                        >
                            {idx > 0 &&
                                <>
                                    &nbsp;
                                    <b>{cond.op}</b>
                                    &nbsp;
                                </>
                            }
                            <i>by <b>{cond.value}</b></i>
                        </div>
                    ))}
                    <div className="flex_expander"></div>
                    <div
                        className="flex_horizontal"
                    >
                        <button
                            onClick={_ => setEditedSetting(setting)}
                            style={{ fontSize: "1.2rem" }}
                        >
                            ✎
                        </button>
                        <button
                            onClick={_ => deleteSetting(setting)}
                            style={{ fontSize: "1.2rem", marginLeft: "10px" }}
                        >
                            🗑
                        </button>
                    </div>
                </>
            )}
        </ThemeContext.Consumer>
    );
};
