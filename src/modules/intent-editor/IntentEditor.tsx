import * as React from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { Breadcrumb, Segment, Container, Input, List } from 'semantic-ui-react';
import { ConnectedIntentCategory } from './intent-category';
import { ConnectedIntentSubCategory } from './intent-subcat';
import { ConnectedIntentList } from './intent-subcat/intent-list';
import { ConnectedResponseEditor } from './response-editor';
import { ConnectedNewResponseCreator } from './new-response-creator';
import startCase from 'lodash-es/startCase';
import capitalize from 'lodash-es/capitalize';
import sortBy from 'lodash-es/sortBy';
import * as styles from './styles.css';

interface IntentEditorProps {
  // object
  category: string;
  fetchResources: () => AnyAction;
  fetchPendingResources: () => AnyAction;
  resetCategory: () => AnyAction;
  searchTerm: string;
  resources: object;
  currentPage: string;

  // function
  updateSearchTerm: (term: string) => any;
  updatePageStatus: (category: string) => any;
}

function callAllIntent(resources: {[key: string]: any}) {
  const tsx: any = [];
  Object.keys(resources).map((mainCategory) => {
    Object.keys(resources[mainCategory]).map((subCategory) => {
      tsx.push(
          <List.Item key={'INTENTS_IN_' + mainCategory + '_' + subCategory}>
              <ConnectedIntentList
                commands={resources[mainCategory][subCategory]}
                mainCategory={mainCategory}
                subCategory={subCategory}
              />
          </List.Item>,
      );
    });
  });
  return tsx;
}

class IntentEditor extends React.PureComponent<IntentEditorProps> {
  componentWillMount() {
    this.props.fetchResources();
    this.props.fetchPendingResources();
  }

  render() {
    const {
      category,
      resetCategory,
      searchTerm,
      resources,
      updateSearchTerm,
      currentPage,
      updatePageStatus,
    } = this.props;
    const inMainPage = currentPage === 'mainPage';
    const triggerUpdateSearchTerm = (e:any) => updateSearchTerm(e.target.value);
    const hasSearchTerm = Boolean(searchTerm);
    const backToMainPage = () => {
      resetCategory();
      updatePageStatus('mainPage');
      updateSearchTerm('');
    };

    return (
      <Container>
        <Input
          icon="search"
          type="text"
          value={searchTerm}
          onChange={triggerUpdateSearchTerm}
          placeholder="Search intents and response..."
          className={styles.searchBox}
          fluid={true}
        />
        <Segment
          basic={true}
          style={{
            paddingTop: 5,
            paddingBottom: 0,
          }}
        >
          <Breadcrumb
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <Breadcrumb.Section
              link={true}
              onClick={backToMainPage}
            >{inMainPage ? <b>Main</b> : 'Main'}
            </Breadcrumb.Section>
            {inMainPage ? '' : <Breadcrumb.Divider icon="chevron right" />}
            {inMainPage ? '' :
              <Breadcrumb.Section>
                <b>{startCase(capitalize(category))}</b>
              </Breadcrumb.Section>
            }
            { (searchTerm.length > 0) ?
              <Breadcrumb.Section>
                <Breadcrumb.Divider icon="chevron right" />
                <b>search for: {searchTerm}</b>
              </Breadcrumb.Section>
            : ''}
          </Breadcrumb>
        </Segment>
        {inMainPage && !hasSearchTerm ? <ConnectedIntentCategory /> : ''}
        {!inMainPage ? <ConnectedIntentSubCategory/> : ''}
        {inMainPage && hasSearchTerm ?
          <div>
            {callAllIntent(resources)}
          </div>

        : ''
        }
        <ConnectedResponseEditor/>
        <ConnectedNewResponseCreator/>
      </Container>
    );

  }
}

export { IntentEditorProps, IntentEditor };
