import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
  Menu,
  Icon,
  Checkbox,
  Popup,
  Label,
  List,
  Header,
  Loader,
} from 'semantic-ui-react';
import * as moment from 'moment';
import isNil from 'lodash-es/isNil';
import last from 'lodash-es/last';
import defaultTo from 'lodash-es/defaultTo';
import each from 'lodash-es/each';
import unary from 'lodash-es/unary';
import transform from 'lodash-es/transform';
import every from 'lodash-es/every';
import isEmpty from 'lodash-es/isEmpty';
import negate from 'lodash-es/negate';
import get from 'lodash-es/get';
import map from 'lodash-es/map';
import findLastIndex from 'lodash-es/findLastIndex';
import * as styles from './styles.css';
import { StylePropType } from '../../../commons/PropTypes';
import { api } from '../../../commons/Api';
import { ConnectedMessageController } from './controller';
import { ConnectedRating } from './rating';

const TEXT_FROM_USER_ITERATIVE = { sender: 'USER', body: { type: 'TEXT' } };

interface MessageListProps extends StylePropType {
  conversations: any[];
  messages: any;
  selectedConversation: any;
  totalConversation: number;
  loading: boolean;
  selectedMessages: { [key: string]: string[] };
  mode: string;
  suggestions: { [key: string]: any };
  hasNext: boolean;
  defaultPageSize: number;
  nextPage: number;
  searchDone: boolean;
  highlightedId: string;
  highlightedMessage: string[];
  searchTerm: string;
  startMessagesSync: () => any;
  stopMessagesSync: () => any;
  selectMessage: () => any;
  openRating: () => any;
  openSuggestSelector: () => any;
  fetchSuggestion: (msg: string, msgId: string) => any;
  selectSuggestion: (suggestion: any) => any;
  fetchNextMessagePage: (conversation: any, defaultPageSize: number, pageNumber: number) => any;
  turnOffStatusLoading: () => any;
}

class MessageList extends React.PureComponent<MessageListProps> {

  private div: any;
  private loader: any;
  private lastHeight: any;
  private hasNext: any;
  private notFound = false;

  componentWillMount() {
    this.props.startMessagesSync();
  }

  componentDidMount() {
    if (this.div) {
      this.div.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  componentWillUnmount() {
    this.props.stopMessagesSync();
    if (this.div) {
      this.div.removeEventListener('scroll', this.handleScroll);
    }
  }

  componentDidUpdate(prevProps: MessageListProps) {
    // adjust scroll bar
    const prevMsgId = get(last(prevProps.messages), 'id');
    const curMsgId = get(last(this.props.messages), 'id');
    if (prevProps.loading) {
      this.div.scrollTop += this.div.scrollHeight - this.lastHeight;
    } else if (prevMsgId !== curMsgId && this.div) {
      this.div.scrollTop = this.div.scrollHeight;
    } else if (this.props.highlightedId !== prevProps.highlightedId || this.notFound) {
      const highlightedMsg = document.getElementById(this.props.highlightedId);
      if (highlightedMsg !== null) {
        const msgTop = highlightedMsg.getBoundingClientRect().top;
        const scrollDistance = msgTop - this.div.getBoundingClientRect().top;
        this.div.scrollTop += scrollDistance - 50;
        this.notFound = false;
      } else {
        this.notFound = true;
      }
    }
    // fetch suggestions for latest enquiry
    const prevLastEnquiryIndex = findLastIndex(prevProps.messages, TEXT_FROM_USER_ITERATIVE);
    const curLastEnquiryIndex = findLastIndex(this.props.messages, TEXT_FROM_USER_ITERATIVE);
    const prevLastEnquiry = prevProps.messages[prevLastEnquiryIndex];
    const curLastEnquiry = this.props.messages[curLastEnquiryIndex];
    if (prevLastEnquiry) {
      if (prevLastEnquiry.id !== curLastEnquiry.id) {
        this.props.fetchSuggestion(curLastEnquiry.body.message, curLastEnquiry.id);
      }
    } else {
      if (curLastEnquiry) {
        this.props.fetchSuggestion(curLastEnquiry.body.message, curLastEnquiry.id);
      }
    }
  }

  handleScroll() {
    if (this.loader) {
      const { bottom } = this.loader.getBoundingClientRect();
      const { top } = this.div.getBoundingClientRect();
      const position = bottom - top;
      if (position > 0 && !this.props.loading && this.props.hasNext) {
        this.props.fetchNextMessagePage(
          this.props.selectedConversation,
          this.props.defaultPageSize,
          this.props.nextPage,
        );
        this.lastHeight = this.div.scrollHeight;
      }
    }
  }

  highlighSearchTerm(msg: string) {
    const term = this.props.searchTerm.toLowerCase();
    if (msg.toLowerCase().indexOf(term) === -1 || !this.props.searchDone) {
      return msg;
    }

    const result = [];
    let currPosition = 0;
    let lastPosition = 0;

    while ((currPosition = msg.toLowerCase().indexOf(term, lastPosition)) > -1) {
      result.push(msg.slice(lastPosition, currPosition));
      result.push(<mark key={currPosition}>{msg.substr(currPosition, term.length)}</mark>);
      lastPosition = currPosition + term.length;
    }

    result.push(msg.slice(lastPosition));

    return result;
  }

  render() {
    const {
      conversations,
      messages,
      selectedConversation,
      fetchSuggestion,
      selectedMessages,
      totalConversation,
      selectMessage,
      mode,
      openRating,
      suggestions,
      selectSuggestion,
      openSuggestSelector,
      turnOffStatusLoading,
      highlightedMessage,
      highlightedId,
    } = this.props;
    const filteredMessages = messages.filter(
      (message: any) => message.body.type === 'TEXT'
        || message.body.type === 'OPTIONS'
        || message.body.type === 'IMAGE'
        || message.body.type === 'AUDIO'
        || message.body.type === 'VIDEO');
    const specialMode = mode !== '';
    const latestIncomingMessageIndex = findLastIndex(filteredMessages, TEXT_FROM_USER_ITERATIVE);
    let clickActionOnSpecialMode;

    return (
      <div
        className={`${defaultTo(this.props.className, '')} ${styles.container}`}
        ref={(div: any) => { if (div) this.div = div; }}
      >
        {
          (() => {
            if (!isNil(selectedConversation.id)) {
              if (filteredMessages.length === 0) {
                return (
                  <p className={styles.noMessageMessage}>There are no messages in this issue.</p>
                );
              }

              return (
                <div>
                  <ConnectedMessageController />
                  <div
                    className={styles.loader}
                    ref={(loader: any) => { if (loader) this.loader = loader; }}
                  />
                </div>
              );
            }
          })()
        }
        {
          selectedConversation.id && filteredMessages
            .map((message: any, messageInd: number) => {
              const messageContentType = message.body.type;
              const senderInfo = selectedConversation.id;
              const messageId = message.id;
              const msg = message.body.message;
              let fileUrl: string = '';
              let messages: string[] = [];
              if (messageContentType === 'IMAGE'
                || messageContentType === 'VIDEO'
                || messageContentType === 'AUDIO') {
                fileUrl = api.createFileUrl(senderInfo, messageId);
              }
              const isSelectedMessage = selectedMessages[message.type].indexOf(message) > -1;
              const isRequest = message.type === 'REQUEST';
              const isResponse = message.type === 'RESPONSE';
              const isChatbot = message.sender === 'CHATBOT';
              const needPointer = isRequest || (isResponse && isChatbot);
              const openModalAndFetchSuggestion = (message: string, id: string) => {
                openSuggestSelector();
                if (suggestions.hasOwnProperty(messageId)) {
                  turnOffStatusLoading();
                } else {
                  fetchSuggestion(message, id);
                }
              };
              const openSpecificMenu =
                isRequest ? openModalAndFetchSuggestion.bind(null, msg, messageId) :
                  isChatbot ? openRating.bind(null, messageInd) :
                    () => { };

              clickActionOnSpecialMode =
                specialMode ? selectMessage.bind(null, message) :
                  () => { };

              const chatbotLabel = isChatbot
                ? <Label
                  color="red"
                  content="🤖 robot"
                  ribbon={true}
                />
                : '';
              const chevronDownToggle = needPointer
                ? <Icon
                  onClick={openSpecificMenu}
                  className={styles.clickableIndicator}
                  name="chevron down"
                />
                : '';

              let content = <div />;
              if (messageContentType === 'IMAGE') {
                content = (
                  <div
                  // onClick={clickActionOnSpecialMode}
                  >
                    {chevronDownToggle}
                    <img src={fileUrl} />
                  </div>
                );
              } else if (messageContentType === 'VIDEO') {
                content = (
                  <div
                  // onClick={clickActionOnSpecialMode}
                  >
                    {chevronDownToggle}
                    <video src={fileUrl} controls={true} />
                  </div>
                );
              } else if (messageContentType === 'AUDIO') {
                content = (
                  <div
                    className={styles.text}
                  // onClick={clickActionOnSpecialMode}
                  >
                    {chevronDownToggle}
                    <audio src={fileUrl} controls={true} />
                  </div>
                );
              } else if (messageContentType === 'TEXT' || messageContentType === 'OPTIONS') {
                messages = msg.split('\n');

                content = (
                  <div
                    className={styles.text}
                  // onClick={clickActionOnSpecialMode}
                  >
                    {chevronDownToggle}
                    {chatbotLabel}
                    <div>
                      {messages.map((msg: string, i: number) => (
                        <p key={i}>
                          {highlightedMessage.indexOf(messageId) > -1 ?
                            this.highlighSearchTerm(msg) : msg}
                        </p>
                      ))}
                      {
                        (() => {
                          if (messageContentType === 'OPTIONS') {
                            return (
                              <Button.Group
                                basic={true}
                                vertical={true}
                                fluid={true}
                                className={styles.optionGroup}
                              >
                                {message.body.options.map((item: any) =>
                                  (<Button key={item.id} content={item.message} />),
                                )}
                              </Button.Group>
                            );
                          }
                        })()
                      }
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={messageId}
                  id={messageId}
                  className={`
                    ${styles.message}
                    ${isRequest ? styles.inMessage : styles.outMessage}
                    ${isChatbot ? styles.chatbotMessage : ''}
                    ${isSelectedMessage ? styles.selectedMessage : ''}
                    ${messageId === highlightedId ? styles.highlightedMessage : ''}
                  `}
                >
                  <div
                    className={styles.contentDiv}
                    style={{ flexDirection: isRequest ? 'row' : 'row-reverse' }}
                  >
                    {content}
                    {specialMode
                      ? <Checkbox
                        className={styles.specialModeCheckbox}
                        onClick={clickActionOnSpecialMode}
                        checked={isSelectedMessage}
                      />
                      : ''
                    }
                  </div>
                  <div className={styles.date}>
                    {moment(message.date).format('YYYY-MMM-DD dddd, h:mm a')}
                    {
                      (() => {
                        if (!isNil(message.issueId)) {
                          return (
                            <div className={styles.issue}>
                              <Icon name="star" color="purple" />
                            </div>
                          );
                        }
                      })()
                    }
                  </div>
                  {
                    messageInd === latestIncomingMessageIndex
                      ? ((suggestions.hasOwnProperty(messageId)))
                        ? <div className={styles.answerLabel}>
                          <Label
                            color="orange"
                            pointing="above"
                            style={{ borderRadius: '1em' }}
                          >
                            <List selection={true} divided={true} relaxed="very" >
                              {!isEmpty(suggestions[messageId]) ? 'Suggested Answer: ' : ''}
                              {!isEmpty(suggestions[messageId])
                                ? suggestions[messageId].map(
                                  (suggest: { [key: string]: string }, index: number) => {
                                    return (
                                      <List.Item
                                        key={'ANS_BUBBLE_' + index + suggest.answer}
                                        onClick={selectSuggestion.bind(null, suggest.answer)}
                                        icon="reply"
                                        content={`${suggest.answer}`}
                                      />
                                    );
                                  },
                                )
                                : <List.Item
                                  content="No default answer"
                                  icon="warning"
                                />
                              }
                            </List>
                          </Label>
                        </div>
                        : <div className={styles.answerLabel}>
                          <Label color="orange" pointing="above">
                            <Icon name="circle notched" loading={true} size="large" />
                          </Label>
                        </div>
                      : ''
                  }
                </div>
              );
            })
        }
        {
          (() => {
            if (!selectedConversation.id) {
              const unreadCount = conversations.map((conversation) => {
                const seenTimestamp = parseInt(moment(conversation.seen).format('x'), 10);
                const messageTimestamp =
                  parseInt(moment(conversation.lastUpdatedDate).format('x'), 10);
                return seenTimestamp < messageTimestamp ? 1 : 0;
              })
                .reduce((a, b) => a + b, 0);
              return (
                <p className={styles.noIssueSelected}>
                  {`There are total ${totalConversation}
                  conversation${totalConversation > 1 ? 's' : ''}
                  and ${''} ${unreadCount} conversation${unreadCount > 1 ? 's' : ''} unread.`}
                </p>
              );
            }
          })()
        }
        <ConnectedRating />
      </div>
    );
  }
}

export { MessageListProps, MessageList };
