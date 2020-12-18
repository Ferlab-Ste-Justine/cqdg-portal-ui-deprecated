// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Progress from 'react-progress';
import './ProgressContainer.css';


const ProgressContainer = compose(
  connect(state => ({ percent: state.relayProgress.percent })),
)(({ percent }) => (
  <Progress
    className="progress-bar"
    color="#18486B"
    height={3}
    hideDelay={0.1}
    percent={percent}
    speed={2}
    />
));

export default ProgressContainer;
