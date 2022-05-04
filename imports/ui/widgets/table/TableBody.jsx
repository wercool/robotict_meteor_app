import React from 'react';

/**
 * Table items display component
 * @prop {*} items -- array of items to display
 */
export const TableBody = ({
    items,
}) => {
    return (
        <tbody>
            {items.map((item, idx) => (
                <tr key={idx}>
                    {Object.keys(item).map((item_key, idx) => (
                        <td key={idx}>
                            {item[item_key]}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};