import React from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const SimpleDropDown = ({
    items,
    style={},
    onChange
}) => {

    const defaultValueItem = items.find(item => item.selected);

    return (
        <ThemeContext.Consumer>
            {theme => (
                <select
                    style={(theme.elements && theme.elements.select) || style}
                    onChange={onChange && onChange}
                    defaultValue={defaultValueItem && defaultValueItem.value}
                >
                    {items.map((item, idx) => 
                        <option 
                            value={item.value}
                            key={idx}
                        >
                            {item.label}
                        </option>
                    )}
                </select>
            )}
        </ThemeContext.Consumer>
    );
};
