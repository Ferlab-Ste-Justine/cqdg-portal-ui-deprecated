import React from 'react';
import QueryLayout from '@cqdg/components/layouts/QueryLayout';

import StudyCards from './StudyCards/StudyCards';

import './StudyPage.css';

const StudyPage = () => {
  return (
    <div id="StudyPage">
      <QueryLayout results={<div className="container-results"><StudyCards /></div>} />
    </div>
  );
};


export default StudyPage;
