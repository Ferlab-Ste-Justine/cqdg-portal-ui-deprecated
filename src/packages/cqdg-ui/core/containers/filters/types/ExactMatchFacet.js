/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

// Vendor
import React from 'react';
import { compose, withState, pure } from 'recompose';

import StackLayout from 'cqdg-ui/core/layouts/StackLayout';

import {
  getCurrentFilters,
} from '@cqdg/store/query';
import { getFilterValue, makeFilter } from '@cqdg/utils/filters';

import CheckCircleOIcon from 'react-icons/lib/fa/check';
import { Tooltip } from '@cqdg/components/Tooltip';
import Link from '@cqdg/components/Links/Link';

const ExactMatchFacet = compose(
  withState('inputValue', 'setInputValue', ''),
  pure,
)(
  ({
    collapsed,
    doctype,
    fieldNoDoctype,
    inputValue,
    placeholder,
    setInputValue,
    style,
    title,
  }) => {
    const currentFilters = getCurrentFilters({ content: [] }).content;
    const currentValues = getFilterValue({
      currentFilters,
      dotField: `${doctype}.${fieldNoDoctype}`,
    }) || { content: { value: [] } };

    return (
      <div className="test-exact-match-facet" style={style}>
        {!collapsed && (
          <StackLayout vertical>
            {currentValues.content.value.map(v => (
              <StackLayout horizontal key={v}>
                <Tooltip Component="Click to remove">
                  <Link
                    merge="toggle"
                    query={{
                      filters: makeFilter([
                        {
                          field: `${doctype}.${fieldNoDoctype}`,
                          value: [v],
                        },
                      ]),
                    }}
                    >
                    <CheckCircleOIcon
                      style={{ paddingRight: '0.5rem' }}
                      />
                    {v}
                  </Link>
                </Tooltip>
              </StackLayout>
            ))}
            <StackLayout horizontal>
              <label htmlFor={fieldNoDoctype}>
                {title}
              </label>
              <input
                id={fieldNoDoctype}
                name={fieldNoDoctype}
                onChange={e => {
                  setInputValue(e.target.value);
                }}
                placeholder={placeholder}
                style={{
                  borderRadius: '4px 0 0 4px',
                }}
                type="text"
                value={inputValue}
                />
              <Link
                dark={!!inputValue}
                merge="toggle"
                onClick={inputValue ? () => setInputValue('') : null}
                query={
                        inputValue && {
                          filters: makeFilter([
                            {
                              field: `${doctype}.${fieldNoDoctype}`,
                              value: [inputValue],
                            },
                          ]),
                        }
                      }
                >
                      Go!
              </Link>
            </StackLayout>
          </StackLayout>
        )}
      </div>
    );
  },
);

export default ExactMatchFacet;
