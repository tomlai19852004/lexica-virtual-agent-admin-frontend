import * as React from 'react';
import * as moment from 'moment';
import range from 'lodash-es/range';
import uniq from 'lodash-es/uniq';
import isNil from 'lodash-es/isNil';
import isNumber from 'lodash-es/isNumber';
import cloneDeep from 'lodash-es/cloneDeep';
import startCase from 'lodash-es/startCase';
import { Loader, Table } from 'semantic-ui-react';
import * as d3 from 'd3';
import { ChartGroup, ChartType } from '../Constants';

import 'c3/c3.css';

const star = '⭐';
const newType = 'New';
const dateX = 'Date';

// tslint:disable-next-line
const C3Chart: any = (require('react-c3js') as any).default;

const template: any = {
  data: {
    unload: true,
    x: 'Date',
    xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
    type: 'area',
  },
  axis: {
    x: {
      type: 'timeseries',
      localtime: true,
      tick: {
        format: '%Y-%m-%d',
        outer: false,
      },
    },
    y: {
      tick: {
        format: (i: number) => Number.isInteger(i) ? d3.format('d')(i) : '',
        outer: false,
      },
    },
  },
  size: {
    height: 600,
  },
  unloadBeforeLoad: true,
  point: {
    show: false,
  },
};

interface ChartProps {
  startDate: moment.Moment;
  endDate: moment.Moment;
  chartType: ChartType;
  chartGroup: ChartGroup;
  statistics: any[];
  fetchingStatistics: boolean;
}

function generateStar(total: number) {
  return range(0, total).map(() => star).reduce((p, c) => p + c, '');
}

function getStatisticsTypeValues(statistics: any[], type: ChartType) {
  return range(1, 6).map(i => generateStar(i)).concat(['New']);
}

function toStatisticMap(statistics: any[], type: ChartType, group: ChartGroup, typeValue: string) {
  return statistics
    .filter((statistic) => {
      let result;
      if (typeValue === newType) {
        result = statistic._id.newType === true;
      } else {
        result = statistic._id.rating === typeValue.length;
      }
      return result;
    })
    .map((statistic) => {
      const {
        year,
        month,
        week,
        dayOfMonth,
        hour,
      } = statistic._id;

      let current = moment().utc().year(year).month(month - 1);

      if (group === ChartGroup.DAY || group === ChartGroup.HOUR) {
        current = current.startOf('day');
      } else if (group === ChartGroup.WEEK) {
        current = current.startOf('week');
      } else if (group === ChartGroup.MONTH) {
        current = current.startOf('month');
      }

      if (week) {
        current = current.week(week);
      }

      if (dayOfMonth) {
        current = current.date(dayOfMonth);
      }

      if (hour) {
        current = current.hour(hour);
      }

      return {
        id: current.toISOString(),
        count: statistic.count,
      };
    })
    .reduce(
    (prev: any, curr) => {
      prev[curr.id] = curr;
      return prev;
    },
    {},
  );
}

function processStatistics(props: ChartProps) {
  const {
    startDate,
    endDate,
    chartType,
    chartGroup,
    statistics,
  } = props;
  const start = moment.utc(startDate).startOf('day');
  const end = moment.utc(endDate).endOf('day');
  const typeValues = getStatisticsTypeValues(statistics, chartType);
  const chartProps = cloneDeep(template);
  let momentUnit: moment.unitOfTime.Base = 'days';
  let duration: number;

  switch (chartGroup) {
    case ChartGroup.DAY:
      momentUnit = 'days';
      break;
    case ChartGroup.MONTH:
      momentUnit = 'months';
      break;
    case ChartGroup.WEEK:
      momentUnit = 'weeks';
      break;
    case ChartGroup.HOUR:
      momentUnit = 'hours';
      break;
  }

  duration = moment.duration(start.diff(end)).as(momentUnit);
  duration = Math.ceil(Math.abs(duration));
  chartProps.data.columns = [];

  typeValues.sort((a , b) => {
    if (a === newType) {
      return 1;
    }

    if (b === newType) {
      return -1;
    }

    return b.length - a.length;
  });

  typeValues.forEach((value) => {
    const statisticMap = toStatisticMap(statistics, chartType, chartGroup, value);
    const statisticMapCount = Object.keys(statisticMap).length;
    const data = range(0, duration < statisticMapCount ? statisticMapCount : duration)
      .map((i) => {
        let current = moment.utc(start.toDate()).add(i, momentUnit);
        if (chartGroup === ChartGroup.WEEK) {
          current = current.startOf('week');
        } else if (chartGroup === ChartGroup.MONTH) {
          current = current.startOf('month');
        }
        const id = current.toISOString();
        if (statisticMap.hasOwnProperty(id)) {
          return statisticMap[id];
        }
        return {
          id,
          count: 0,
        };
      });
    const counts = data.map(d => d.count);
    if (chartProps.data.columns.length === 0) {
      const ids = data.map(d => d.id);
      chartProps.data.columns.push([dateX].concat(ids));
    }

    chartProps.data.columns.push([startCase(value)].concat(counts));
  });

  if (chartGroup === ChartGroup.HOUR) {
    chartProps.axis.x.tick.format = (x: Date) => {
      const date = moment(x);
      return date.format('MMM-DD HH:mm');
    };
  } else if (chartGroup === ChartGroup.DAY) {
    chartProps.axis.x.tick.format = (x: Date) => {
      const date = moment(x);
      return date.format('DD MMM YYYY');
    };
  } else if (chartGroup === ChartGroup.WEEK) {
    chartProps.axis.x.tick.format = (x: Date) => {
      const date = moment(x);
      return `WK${date.isoWeek()} ${date.format('YYYY')}`;
    };
  } else if (chartGroup === ChartGroup.MONTH) {
    chartProps.axis.x.tick.format = (x: Date) => {
      const date = moment(x);
      return date.format('MMM YYYY');
    };
  }

  if (chartProps.data.columns.length >= 2) {
    chartProps.data.colors = {
      [chartProps.data.columns[1][0]]: '#7C60E6',
    };
  }

  if (chartProps.data.columns.length >= 1 && chartProps.data.columns[0].length <= 2) {
    chartProps.point.show = true;
  }

  return chartProps;

}

class Chart extends React.Component<ChartProps> {

  shouldComponentUpdate(nextProps: ChartProps) {
    return this.props.statistics !== nextProps.statistics
      || this.props.fetchingStatistics !== nextProps.fetchingStatistics;
  }

  render() {
    const { statistics, fetchingStatistics } = this.props;
    if (fetchingStatistics) {
      return (
        <Loader inline="centered" indeterminate={true} active={true} />
      );
    }
    const chartProps = processStatistics(this.props);
    return [
      <C3Chart {...chartProps} key="chart" />,
      <DataTable {...chartProps} key="dataTable" />,
    ];
  }
}

class DataTable extends React.PureComponent<any> {

  render() {
    const { data, axis } = this.props;
    const timeParse = d3.timeParse(data.xFormat);
    if (data.columns.length > 0) {
      const dateFormat = axis.x.tick.format;
      return (
        <Table celled={true} striped={true} textAlign="center">
          <Table.Header>
            <Table.Row>
              {
                data.columns.map((column: string[]) => (
                  <Table.HeaderCell
                    style={{ width: `${100 / data.columns.length}%` }}
                    key={column[0]}
                  >
                    {column[0]}
                  </Table.HeaderCell>
                ))
              }
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              range(1, data.columns[0].length).map(i => (
                <Table.Row key={i}>
                  {
                    range(0, data.columns.length).map((j) => {
                      if (j === 0) {
                        return (
                          <Table.Cell key={`${j}${i}`}>
                            {
                              dateFormat(timeParse(data.columns[j][i]))
                            }
                          </Table.Cell>
                        );
                      }
                      return (
                        <Table.Cell key={`${j}${i}`}>{data.columns[j][i]}</Table.Cell>
                      );
                    })
                  }
                </Table.Row>
              ))
            }
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              {
                data.columns.map((column: string[], i: number) => (
                  <Table.HeaderCell key={i}>
                    {
                      (() => {
                        const filtered: number[] = column.filter(isNumber).map(parseFloat);
                        if (filtered.length === 0) {
                          return '';
                        }
                        return filtered.reduce((prev, cur) => prev + cur, 0);
                      })()
                    }
                  </Table.HeaderCell>
                ))
              }
            </Table.Row>
          </Table.Footer>
        </Table>
      );
    }
    return null;
  }

}

export { Chart };
