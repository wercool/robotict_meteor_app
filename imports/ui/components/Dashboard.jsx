import React, { useCallback, useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Table } from '../widgets/table/Table';
import { SettingsCollection } from '../../api/settings';

const _items = [...Array(105).keys()].map(i => i + 1);

export const Dashboard = () => {

    const settings = useTracker(() => SettingsCollection.find({}).fetch());

    const [items, setItems] = useState([]);

    const [pagination, setPagination] = useState({
        total: _items.length,
        page_size: 10,
        current_page: 1,
        from_page: 1,
    });

    useEffect(() => {
        setItems(
            _items.slice(
                (pagination.current_page - 1) * pagination.page_size, 
                (pagination.current_page - 1) * pagination.page_size + pagination.page_size
            )
        );
    }, [pagination]);

    /**
     * Business logic
     */
    const labelFunction = useCallback(value => {
        let label = `${value}`;

        if (settings.length === 0) {
            return `${label}`;
        }

        // check first for simple rules
        const simple_settings = settings.filter(setting => setting.cond.length === 1);
        for (const simple_setting of simple_settings) {
            if (value % simple_setting.cond[0].value === 0) {
                label = simple_setting.sub;
            }
        }

        // check then for complex rules
        const complex_settings = settings.filter(setting => setting.cond.length > 1);
        for (const complex_setting of complex_settings) {

            // check for `|` rules first
            let complex_rule_satisfied = false;
            const or_conditions = complex_setting.cond.filter(cond => cond.op === '|');
            for (const or_condition of or_conditions) {
                if (value % or_condition.value === 0) {
                    complex_rule_satisfied = true;
                    break;
                }
            }
            // if `|` rules applicable just go check next complex_setting
            if (complex_rule_satisfied) {
                label = complex_setting.sub;
                continue;
            }

            // if `|` rules are not applicable check for `&`
            complex_rule_satisfied = true;
            const and_conditions = complex_setting.cond.filter(cond => cond.op === '&');
            and_conditions.unshift(complex_setting.cond[0]);
            for (const and_condition of and_conditions) {
                if (value % and_condition.value !== 0) {
                    complex_rule_satisfied = false;
                }
            }

            if (complex_rule_satisfied) {
                label = complex_setting.sub;
            }
        }

        return `${label}`;
    }, [settings]);

    return (
        <Table
            columns={[
                { label: 'NUBER', style: { width: '25%' } },
                { label: 'SUBSTITUTION' }
            ]}
            items={items.map(item => ({
                id: `${item}`,
                label: labelFunction(Number(item))
            }))}
            pagination={pagination}
            setPagination={setPagination}
        />
    );
};
