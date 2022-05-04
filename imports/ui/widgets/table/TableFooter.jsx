import React from 'react';

import { SimpleDropDown } from '../../elements/SimpleDropDown';
import { ThemeContext } from '../../contexts/ThemeContext';
import { TablePagination } from './TablePagination';

/**
 * Table items display component
 * @prop {*} items -- array of items to display
 */
export const TableFooter = ({
    columns,
    pagination,
    setPagination
}) => {

    return (
        <ThemeContext.Consumer>
            {theme => (
                <tfoot
                    style={(theme.table && theme.table.footer) || {}}
                >
                    <tr>
                        <td colSpan={columns.length}>
                            <div>
                                <TablePagination
                                    pagination={pagination}
                                    setPagination={setPagination}
                                />

                                <div className="flex_expander"></div>

                                <SimpleDropDown
                                    items={[
                                        { label: '5',   value: 5 },
                                        { label: '10',  value: 10 },
                                        { label: '20',  value: 20 },
                                        { label: '50',  value: 50 },
                                    ].map(item => ({ ...item, selected: item.value === pagination.page_size}))}
                                    onChange={event => {
                                        if (event && event.target) {
                                            setPagination({
                                                ...pagination,
                                                page_size: Number(event.target.value),
                                                current_page: 1,
                                                from_page: 1
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </td>
                    </tr>
                </tfoot>
            )}
        </ThemeContext.Consumer>
    );

};