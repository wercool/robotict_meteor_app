import React from 'react';
import { TableHead } from './TableHead';
import { ThemeContext } from '../../contexts/ThemeContext';
import { TableBody } from './TableBody';
import { TableFooter } from './TableFooter';

export const Table = ({
    caption,
    columns,
    items,
    pagination,
    setPagination
}) => {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <table style={(theme.table && theme.table.container) || {}}>
                    {caption && <caption>{caption}</caption>}
                    <TableHead
                        columns={columns}
                    />
                    <TableBody
                        items={items || []}
                    />
                    <TableFooter
                        columns={columns || []}
                        pagination={pagination}
                        setPagination={setPagination}
                    />
                </table>
            )}
        </ThemeContext.Consumer>
    );
};
