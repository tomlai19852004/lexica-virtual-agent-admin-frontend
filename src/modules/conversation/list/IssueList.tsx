import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Menu, Icon, Checkbox, Input, Loader } from 'semantic-ui-react';
import * as moment from 'moment';
import * as styles from './styles.css';
import { StylePropType } from '../../../commons/PropTypes';
import { ConversationStatus } from '../../../commons/Constants';

interface IssueListPropType extends StylePropType {
  // object
  conversations: any;
  selectedConversation: any;
  conversationStatus: ConversationStatus;
  searchTerm: string;
  loading: boolean;
  nextPage: number;
  hasNext: boolean;
  pageSize: number;

  // functions
  selectConversation: (issue: any) => any;
  startConversationSync: () => any;
  stopConversationSync: () => any;
  updateConversationStatus: (status: ConversationStatus) => any;
  updateSearchTerm: (term: string) => any;
  fetchNextConversationPage:
    (status: ConversationStatus, pageNumber: number, pageSize: number, query: string) => any;
}

class IssueList extends React.PureComponent<IssueListPropType> {

  private div: any;
  private loader: any;

  componentWillMount() {
    this.props.startConversationSync();
  }

  componentDidMount() {
    if (this.div) {
      this.div.addEventListener('wheel', this.handleScroll.bind(this));
    }
  }

  componentWillUnmount() {
    this.props.stopConversationSync();
    if (this.div) {
      this.div.removeEventListener('wheel', this.handleScroll);
    }
  }

  componentDidUpdate() {
    this.handleScroll();
  }

  selectIssue(issue: any) {
    this.props.selectConversation(issue);
  }

  handleScroll() {
    if (this.loader && !this.props.loading) {
      const { top } = this.loader.getBoundingClientRect();
      const position = window.innerHeight - top;
      if (position > 0 && this.props.hasNext) {
        this.props.fetchNextConversationPage(
          this.props.conversationStatus,
          this.props.nextPage,
          this.props.pageSize,
          this.props.searchTerm,
        );
      }
    }
  }

  render() {
    const {
      conversations,
      selectedConversation,
      conversationStatus,
      updateConversationStatus,
      updateSearchTerm,
      searchTerm,
      hasNext,
    } = this.props;
    const openStatus = updateConversationStatus.bind(null, ConversationStatus.OPEN);
    const closedStatus = updateConversationStatus.bind(null, ConversationStatus.CLOSED);
    const allStatus = updateConversationStatus.bind(null, ConversationStatus.ALL);
    const triggerUpdateSearchTerm = (e: any) => updateSearchTerm(e.target.value);
    return (
      <div
        className={this.props.className}
        ref={(div: any) => { if (div) this.div = div; }}
      >
        <Menu pointing={true} widths="3" className={styles.issueMenu}>
          <Menu.Item
            name="Open"
            onClick={conversationStatus !== ConversationStatus.OPEN ? openStatus : () => {}}
            active={conversationStatus === ConversationStatus.OPEN}
          />
          <Menu.Item
            name="Closed"
            onClick={conversationStatus !== ConversationStatus.CLOSED ? closedStatus : () => {}}
            active={conversationStatus === ConversationStatus.CLOSED}
          />
          <Menu.Item
            name="All"
            onClick={conversationStatus !== ConversationStatus.ALL ? allStatus : () => {}}
            active={conversationStatus === ConversationStatus.ALL}
          />
        </Menu>
        <Input
          icon="search"
          type="text"
          value={searchTerm}
          onChange={triggerUpdateSearchTerm}
          placeholder="Search..."
          className={styles.searchBox}
          fluid={true}
        />
        <div className={styles.conversationList}>
          {
            conversations
              .filter((conversation: any) =>
                conversation.firstName.toLowerCase().includes(searchTerm.toLowerCase())
                || conversation.lastName.toLowerCase().includes(searchTerm.toLowerCase())
                || conversation.id.includes(searchTerm),
              ).map((conversation: any) => {
                const selectIssue = this.selectIssue.bind(this, conversation);
                const seenTimestamp = parseInt(moment(conversation.seen).format('x'), 10);
                const messageTimestamp = parseInt(
                  moment(conversation.lastUpdatedDate).format('x'),
                  10,
                );
                const { firstName, middleName, lastName } = conversation;
                const name = `${firstName} ${middleName ? middleName : ''} ${lastName}`.trim();
                return (
                  <div
                    key={conversation.id}
                    className={`
                      ${styles.issue}
                      ${conversation.id === selectedConversation.id ? styles.issueSelected : ''}
                      ${
                      seenTimestamp < messageTimestamp
                        && conversation.id !== selectedConversation.id
                        ? styles.notSeen
                        : ''
                      }
                    `}
                    onClick={selectIssue}
                  >
                    <Icon name="user" color="green" size="big" circular={true} />
                    <div className={styles.name}>
                      {name === '' ? 'Anonymous' : name}
                    </div>
                    <div className={styles.ago}>
                      {moment(conversation.lastUpdatedDate).fromNow()}
                    </div>
                  </div>
                );
              })
          }
          {
            (() => {
              if (conversations.length === 0) {
                return (
                  <p className={styles.noIssueMessage}>No conversations.</p>
                );
              }
              if (hasNext) {
                return (
                  <div
                    ref={(div: any) => { if (div) this.loader = div; }}
                    className={styles.loader}
                  >
                    <Loader active={true} inline="centered" />
                  </div>
                );
              }
              if (!hasNext) {
                this.loader = undefined;
              }
            })()
          }
        </div>
      </div>
    );
  }
}

export { IssueListPropType, IssueList };
