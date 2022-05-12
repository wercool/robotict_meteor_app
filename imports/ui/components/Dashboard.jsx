import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Table } from '../widgets/table/Table';
import { SettingsCollection } from '../../api/settings';
import DoubleRangeSlider from './stateless-reusable/DoubleRangeSlider';

export const Dashboard = () => {
    const settings = useTracker(() => SettingsCollection.find({}).fetch());

    const [items, setItems] = useState([]);
    const [numberRange, setNumberRange] = useState([0, 100]);

    const numberRangeBoundariesRef = useRef([0, 100]);
    const numberArrayRef = useRef([]);

    const [pagination, setPagination] = useState({
        total: 0,
        page_size: 10,
        current_page: 1,
        from_page: 1,
    });

    const getSettingByName = useCallback((name) => {
        return SettingsCollection.findOne({ name });
    }, []);

    useEffect(() => {
        setItems(
            numberArrayRef.current.slice(
                (pagination.current_page - 1) * pagination.page_size, 
                (pagination.current_page - 1) * pagination.page_size + pagination.page_size
            )
        );
    }, [pagination]);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: numberArrayRef.current.length,
            current_page: 1,
            from_page: 1,
        });
    }, [numberRange]);

    useEffect(() => {
        const number_range_entry = getSettingByName('number_range');
        if (number_range_entry) {
            if (numberRangeBoundariesRef.current[0] !== number_range_entry.value.from
             || numberRangeBoundariesRef.current[1] !== number_range_entry.value.to
             || numberRange[0] !== number_range_entry.value.range[0]
             || numberRange[1] !== number_range_entry.value.range[1]
             ) {
                numberRangeBoundariesRef.current = [number_range_entry.value.from, number_range_entry.value.to];

                const size = number_range_entry.value.range[1] - number_range_entry.value.range[0];

                numberArrayRef.current = [...Array(size + 1).keys()].map(i => i + number_range_entry.value.range[0]);

                setNumberRange(number_range_entry.value.range);
            }
        }
    }, [settings]);

    const onRangeChangeCallback = useCallback(range => {
        const number_range_entry = getSettingByName('number_range');
        if (number_range_entry) {
            SettingsCollection.update(number_range_entry._id, {
                $set: {
                    value: {
                        ...number_range_entry.value,
                        range: range.map(Math.round)
                    }
                }
            });
        }
    }, [settings]);

    /**
     * Business logic
     */
    const labelFunction = useCallback(value => {
        let label = `${value}`;

        const display_rules_setting = getSettingByName('display_rules');

        const display_rules = (display_rules_setting && display_rules_setting.value) || [];

        if (display_rules.length === 0) {
            return `${label}`;
        }

        // check first for simple rules
        const simple_settings = display_rules.filter(setting => setting.cond.length === 1);
        for (const simple_setting of simple_settings) {
            if (value % simple_setting.cond[0].value === 0) {
                label = simple_setting.sub;
            }
        }

        // check then for complex rules
        const complex_settings = display_rules.filter(setting => setting.cond.length > 1);
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
        <div
            className='flex_vertical'
        >
            <DoubleRangeSlider
                rangeBoundaries={numberRangeBoundariesRef.current}
                rangeDefaults={numberRange}
                onRangeChanged={onRangeChangeCallback}
                label={
                    <div
                        className={[
                            'noselect'
                        ].join(' ')}
                        style={{
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            marginBottom: '10px'
                        }}
                    >
                        Number range
                    </div>
                }
                componentStyle={{
                    maxWidth: '200px',
                }}
            />
            <br/>
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
        </div>
    );
};
