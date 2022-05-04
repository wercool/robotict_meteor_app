import React from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

export const TablePagination = ({
    pagination,
    setPagination
}) => {

    const pages = [...Array(10).fill().map((v, i) => pagination.from_page + i)];

    return (
        <ThemeContext.Consumer>
            {theme => (
                <div
                    className="table_pagination"
                >
                    {/* first page button */}
                    {pagination.from_page > 1 &&
                        <button
                            style={(theme.button && theme.button.generic) || {}}
                            onClick={_ => setPagination({
                                ...pagination,
                                current_page: 1,
                                from_page: 1
                            })}
                        >
                            1
                        </button>
                    }
                    {/* prev chapter button */}
                    {pagination.from_page > 2 &&
                        <button
                            style={(theme.button && theme.button.generic) || {}}
                            onClick={_ => setPagination({
                                ...pagination,
                                current_page: Math.max(1, pagination.current_page - pagination.page_size + 1),
                                from_page: Math.max(1, pagination.from_page - pagination.page_size + 1)
                            })}
                        >
                            ...
                        </button>
                    }
                    {/* pages buttons mapped from local predefined array `pages` */}
                    {pages.map(page => {
                        if (page <= Math.ceil(pagination.total / pagination.page_size)) {
                            return (
                                <button
                                    className={[
                                        (page === pagination.current_page) && 'selected'
                                    ].filter(Boolean).join(' ')}
                                    style={(theme.button && theme.button.generic) || {}}
                                    onClick={_ => setPagination({
                                        ...pagination,
                                        current_page: page
                                    })}
                                    key={`page${page}`}
                                >
                                    {page}
                                </button>
                            );
                        }
                    })}
                    {/* more button */}
                    {((pagination.total / pagination.page_size) > pages[pages.length - 1]) &&
                        <>
                            <button
                                style={(theme.button && theme.button.generic) || {}}
                                onClick={_ => setPagination({
                                    ...pagination,
                                    current_page: pages[pages.length - 1],
                                    from_page: pages[pages.length - 1]
                                })}
                            >
                                ...
                            </button>
                            {/* last page button */}
                            <button
                                style={(theme.button && theme.button.generic) || {}}
                                onClick={_ => setPagination({
                                    ...pagination,
                                    current_page: Math.ceil(pagination.total / pagination.page_size),
                                    from_page: Math.ceil(pagination.total / pagination.page_size) - 1
                                })}
                            >
                                {Math.ceil(pagination.total / pagination.page_size)}
                            </button>
                        </>
                    }
                </div>
            )}
        </ThemeContext.Consumer>
    );
};