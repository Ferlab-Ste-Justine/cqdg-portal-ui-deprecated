import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import {
  compose,
  withState,
  pure,
} from 'recompose';
import { withTooltip } from '@ncigdc/uikit/Tooltip';
import withSize from '@ncigdc/utils/withSize';
import './style.css';

export const DEFAULT_X_AXIS_LABEL_LENGTH = 10;

const HorizontalBarChart = ({
  data,
  height: h,
  margin: m,
  setTooltip,
  size: { width },
  textFormatter,
}) => {
  const el = ReactFauxDOM.createElement('div');
  el.style.width = '100%';

  el.setAttribute('class', 'bar-chart');
  const innerPadding = 0.3;
  const outerPadding = 0.3;

  const margin = m || {
    top: 20,
    right: 50,
    bottom: 65,
    left: 55,
  };

  const chartWidth = width - margin.left - margin.right;
  const height = (h || 200) - margin.top - margin.bottom;
  const chartColors = [
    '#31BDF2',
    '#D06D5E',
    '#FFB600',
    '#B9BD31',
    '#B37FEB',
    '#008FC7',
    '#FF7A45',
    '#36CFC9',
    '#FADB14',
    '#F759AB',
  ];

  // Create base SVG canvas
  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
    .append('g', 'chart')
    .attr('fill', '#fff')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Configure the display of the X Axis
  const y = d3
    .scaleBand()
    .range([0, height])
    .domain(data.map(d => (textFormatter ? textFormatter(d.id) : d.id)))
    .paddingInner(innerPadding)
    .paddingOuter(outerPadding);

  const yG = svg.append('g').call(d3.axisLeft(y));

  yG.selectAll('.tick')
    .data(data)
    .on('mouseenter', d => {
      setTooltip(d.tooltip);
    })
    .on('mouseleave', () => {
      setTooltip();
    });

  // Configure the display of the X Axis
  const maxValue = d3.max(data, d => d.doc_count);
  const x = d3
    .scaleLinear()
    .range([0, chartWidth])
    .domain([0, maxValue]);

  const xG = svg
    .append('g')
    .attr('class', 'displayOnly')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  xG.selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end');

  // Configure the bars
  const barGs = svg
    .selectAll('g.chart')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar-g');

  const drawBar = (barG, idx) => {
    barG
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', chartColors[idx] || chartColors[Math.floor(Math.random() * Math.floor(chartColors.length - 1))])
      .attr('height', '0.75rem')
      .attr('width', d => x(d.doc_count))
      .attr('x', x(0))
      .attr('y', d => y(textFormatter ? textFormatter(d.id) : d.id))
      .on('click', d => {
        if (d.clickHandler) {
          d.clickHandler(d);
          setTooltip();
        }
      })
      .classed('pointer', d => d.onClick)
      .on('mouseenter', d => {
        setTooltip(d.tooltip);
      })
      .on('mouseleave', () => {
        setTooltip();
      });
  };

  barGs.each(function selectAndDraw(d, i) {
    drawBar(d3.select(this), i);
  });

  return el.toReact();
};

export default compose(
  withTooltip,
  withState('chart', 'setState', <span />),
  withSize({ refreshRate: 16 }),
  pure
)(HorizontalBarChart);
