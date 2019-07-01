import * as React from 'react';
import * as moment from 'moment';
import range from 'lodash-es/range';
import uniq from 'lodash-es/uniq';
import cloneDeep from 'lodash-es/cloneDeep';
import startCase from 'lodash-es/startCase';
import { Loader } from 'semantic-ui-react';
import * as d3 from 'd3';
import { ChartGroup, ChartType } from '../Constants';

import 'c3.css';

// tslint:disable-next-line
const C3Chart: any = (require('react-c3js') as any).default;

const template: any = {
  data: {
    unload: true,
    x: 'x',
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

function getStatisticsTypeValues(statistics: any[], type: ChartType) {
  let result;
  if (type === ChartType.TOTAL) {
    result = [ChartType.TOTAL];
  } else {
    const types = statistics.map((statistic) => {
      let r;
      if (type === ChartType.CATEGORIES) {
        r = statistic._id.category;
      } else if (type === ChartType.CHANNELS) {
        r = statistic._id.channel;
      }
      return r;
    });
    result =  uniq(types);
  }
  return result;
}

function toStatisticMap(statistics: any[], type: ChartType, group: ChartGroup, typeValue?: string) {
  return statistics
    .filter((statistic) => {
      let result;
      if (type === ChartType.TOTAL) {
        result = true;
      } else if (type === ChartType.CATEGORIES) {
        result = statistic._id.category === typeValue;
      } else if (type === ChartType.CHANNELS) {
        result = statistic._id.channel === typeValue;
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
      chartProps.data.columns.push(['x'].concat(ids));
    }

    chartProps.data.columns.push([startCase(value)].concat(counts));
  });

  if (chartGroup === ChartGroup.HOUR) {
    chartProps.axis.x.tick.format = (x: string) => {
      const date = moment(x);
      return date.format('MMM-DD HH:mm');
    };
  } else if (chartGroup === ChartGroup.DAY) {
    chartProps.axis.x.tick.format = (x: string) => {
      const date = moment(x);
      return date.format('DD MMM YYYY');
    };
  } else if (chartGroup === ChartGroup.WEEK) {
    chartProps.axis.x.tick.format = (x: string) => {
      const date = moment(x);
      return `WK${date.isoWeek()} ${date.format('YYYY')}`;
    };
  } else if (chartGroup === ChartGroup.MONTH) {
    chartProps.axis.x.tick.format = (x: string) => {
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
    return (
      <C3Chart {...chartProps} />
    );
  }
}

export { Chart };
