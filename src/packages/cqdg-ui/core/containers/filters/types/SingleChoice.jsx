import React from 'react';

import Radio from 'cqdg-ui/core/buttons/RadioButton';
import StackLayout from 'cqdg-ui/core/layouts/StackLayout';
import Button from 'cqdg-ui/core/buttons/button';

import './SingleChoice.css';

let input;
const SingleChoice = (props) => {
  const {
    dictionary, filterGroup, filters, onChange, selectedFilters = [],
  } = props;

  const selectedFilter = selectedFilters ? selectedFilters[0] : '';
  return (
    <StackLayout className="fui-filter-sc" horizontal>
      <Radio.Group value={selectedFilter}>
        {filters.map(filter => (
          <Radio.Button
            key={filter.key}
            onClick={() => onChange(filterGroup, selectedFilter)}
            value={filter.key}
            >
            {filter.name}
            {/* </Link> */}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Button
        onClick={() => onChange(filterGroup, [])}
        onKeyPress={() => onChange(filterGroup, [])}
        role="button"
        tabIndex="0"
        type="text"
        >
        {dictionary.actions.clear}
      </Button>

      {filters.length === 0 && (
        <span>
          {(input || { value: '' }).value
                      ? dictionary.messages.errorNotFound
                      : dictionary.messages.errorNoData}
        </span>
      )}
    </StackLayout>
  );
};

export default SingleChoice;
