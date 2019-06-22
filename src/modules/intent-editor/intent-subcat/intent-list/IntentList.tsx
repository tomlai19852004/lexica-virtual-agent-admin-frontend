import * as React from 'react';
import { AnyAction } from 'redux';
import { List, Label, Breadcrumb } from 'semantic-ui-react';
import startCase from 'lodash-es/startCase';
import capitalize from 'lodash-es/capitalize';
import sortBy from 'lodash-es/sortBy';
import isNil from 'lodash-es/isNil';

export interface IntentListProps {
  commands: {
    sampleQuestion: string;
    pendingAction: string;
    id: string;
    responses: any[];
  }[];
  subCategory: string;
  searchTerm: string;
  searchTermArr: string[];
  responseHasSearchTerm: boolean;
  intentHasSearchTerm: boolean;
  mainCategory: string;

  startEdit: (commandPath: string) => any;
  selectCategory: (category: string) => any;
}

const actionName: { [key: string]: string } = {
  DELETE: 'Pending Deletion',
  UPDATE: 'Pedning Update',
  ADD: 'Pending Creation',
};

function hasAllSearchTerm(content: string | any[] , searchTermArr: string[]) {
  if (searchTermArr.length === 0) {
    return true;
  }
  let arr: string[] = [];
  if (typeof(content) === 'string') {
    arr.push(content);
  } else if (typeof(content) === 'object') {
    const messages = content[0].messages;
    arr = messages.map((message: any) => message['en-GB']);
  }
  for (const index in arr) {
    for (let i = 0; i < searchTermArr.length; i += 1) {
      // strict search: text must contain all search terms
      if (!arr[index].toLowerCase().includes(searchTermArr[i].toLowerCase())) {
        return false;
      }
    }
    return true;
  }
}

function showMatchingSearchTerm(text: string, searchTermArr: string[]): string[] {
  const matchingSearchTerm = [];
  for (let i = 0; i < searchTermArr.length; i += 1) {
    if (text.toLowerCase().includes(searchTermArr[i])) {
      matchingSearchTerm.push(searchTermArr[i]);
    }
  }
  return matchingSearchTerm;
}

export class IntentList extends React.PureComponent<IntentListProps> {

  render() {
    const {
      commands,
      startEdit,
      searchTerm,
      mainCategory,
      subCategory,
      selectCategory,
    } = this.props;
    const searchTermArr = searchTerm.trim().toLowerCase().split(' ');
    const filteredCommands = sortBy(commands, 'sampleQuestion').filter((command) => {
      const { sampleQuestion, responses } = command;
      const intentHasAllSearchTerm = hasAllSearchTerm(sampleQuestion, searchTermArr);
      const responseHasAllSearchTerm = hasAllSearchTerm(responses, searchTermArr);
      return Boolean(intentHasAllSearchTerm) || Boolean(responseHasAllSearchTerm);
    });
    const hasSearchResult = filteredCommands.length > 0 ;
    // only in the mainpage, intent list will be generated with the input of mainCategory
    const isInMainPage = Boolean(mainCategory);

    return (
      <List
        selection={true}
        verticalAlign="middle"
        divided={true}
        style={{
          marginTop: 30,
        }}
      >
        {isInMainPage && hasSearchResult ?
          <List.Header key={'HEADER_' + mainCategory + '_' + subCategory}>
            <Breadcrumb>
              <Breadcrumb.Section>
                <b>{startCase(capitalize(mainCategory))}</b>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="chevron right" />
              <Breadcrumb.Section >
                <b>{startCase(capitalize(subCategory))}</b>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="chevron right" />
              <Breadcrumb.Section >
                <p>
                  found {filteredCommands.length} intent{filteredCommands.length > 1 ? 's' : ''}
                </p>
              </Breadcrumb.Section>
            </Breadcrumb>
          </List.Header> :
          ''}
        {filteredCommands
          .map((command) => {
            const { sampleQuestion, pendingAction, id, responses } = command;
            const commandPath = `${subCategory}.${id}`;
            const response = responses[0].messages[0]['en-GB'];
            const searchTermFoundInResponse = showMatchingSearchTerm(response, searchTermArr);
            const intentHasAllSearchTerm = hasAllSearchTerm(sampleQuestion, searchTermArr);
            const responseHasAllSearchTerm = hasAllSearchTerm(response, searchTermArr);
            const onlyResponseHasSearchTerm = (
              !Boolean(intentHasAllSearchTerm) &&
              Boolean(responseHasAllSearchTerm) &&
              searchTerm !== ''
            );
            const activateResponseEditor = () => {
              if (!isNil(mainCategory)) {
                selectCategory(mainCategory);
              }
              startEdit(commandPath);
            };

            return (
              <List.Item
                key={commandPath}
                onClick={activateResponseEditor}
                style={{
                  color: '#333333',
                }}
              >
                {sampleQuestion}
                {onlyResponseHasSearchTerm ?
                  <Label pointing="left">
                    Its response contains your search: {searchTermFoundInResponse.join(', ')}
                  </Label> :
                  ''
                }
                {
                  isNil(pendingAction) ?
                    '' :
                    <List.Content floated="right">
                      <Label horizontal={true} color="red">{actionName[pendingAction]}</Label>
                    </List.Content>
                }
              </List.Item>
            );
          })
        }
      </List>
    );
  }
}
