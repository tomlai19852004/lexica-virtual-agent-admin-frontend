import * as React from 'react';
import { Moment } from 'moment';
import startCase from 'lodash-es/startCase';
import toLower from 'lodash-es/toLower';
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Menu,
  DropdownProps,
} from 'semantic-ui-react';
import { DateRangePicker } from '../date-range-picker';
import { ChartGroup, ChartType } from './Constants';
import { Chart } from './chart';

const graphTypeOptions = Object.keys(ChartType).map(type => ({
  key: type,
  text: startCase(toLower(type)),
  value: type,
}));

interface TrafficProps {
  chartType: string;
  chartGroup: string;

  changeType: (type: string) => any;
  changeGroup: (group: string) => any;
  fetchStatistics: () => any;
  switchFetchStatisticsListener: (state: boolean) => any;
}

class Traffic extends React.PureComponent<TrafficProps, any> {

  componentWillMount() {
    this.props.fetchStatistics();
    this.props.switchFetchStatisticsListener(true);
  }

  componentWillUnmount() {
    this.props.switchFetchStatisticsListener(false);
  }

  typeOnChange(
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps,
  ) {
    this.props.changeType(data.value as string);
  }

  groupOnClick(group: string) {
    this.props.changeGroup(group);
  }

  render() {
    const {
      chartType,
      chartGroup,
    } = this.props;
    const typeOnChange = this.typeOnChange.bind(this);
    return (
      <Container fluid={true}>
        <Grid>
          <Grid.Column floated="left" width={8}>
            <Header size="huge">Enquiry Traffic</Header>
          </Grid.Column>
          <Grid.Column floated="right" textAlign="right" width={8}>
            <DateRangePicker />
          </Grid.Column>
          <Grid.Column floated="left" width={8}>
            <Menu compact={true}>
              <Dropdown
                options={graphTypeOptions}
                defaultValue={chartType}
                onChange={typeOnChange}
                simple={true}
                item={true}
              />
            </Menu>
          </Grid.Column>
          <Grid.Column floated="right" textAlign="right" width={8}>
            <Menu pointing={true} secondary={true} compact={true}>
              {
                Object.keys(ChartGroup).map((group) => {
                  const groupOnClick = this.groupOnClick.bind(this, group);
                  return (
                    <Menu.Item
                      key={group}
                      name={startCase(toLower(group))}
                      active={chartGroup === group}
                      onClick={groupOnClick}
                    />
                  );
                })
              }
            </Menu>
          </Grid.Column>
        </Grid>
        <Divider hidden={true} />
        <Chart />
      </Container>
    );
  }
}

export { Traffic };
