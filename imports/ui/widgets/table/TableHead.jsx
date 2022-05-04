import React from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

export const TableHead = ({
    columns,
}) => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <thead
                    className="noselect"
                    style={(theme.table && theme.table.head) || {}}
                >
                    <tr>
                        {columns.map((column, idx) => (
                            <th
                                style={column.style || {}}
                                key={idx}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
            )}
        </ThemeContext.Consumer>
    );
};