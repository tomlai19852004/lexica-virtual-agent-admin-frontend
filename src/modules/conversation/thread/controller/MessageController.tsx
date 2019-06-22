import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  Menu,
  Icon,
  Popup,
  Portal,
  Header,
  Transition,
  SemanticCOLORS,
  Input,
  InputOnChangeData,
  Button,
  SemanticICONS,
  Message,
  TransitionablePortal,
} from 'semantic-ui-react';
import reduce from 'lodash-es/reduce';
import isEmpty from 'lodash-es/isEmpty';
import every from 'lodash-es/every';
import unary from 'lodash-es/unary';
import rearg from 'lodash-es/rearg';
import negate from 'lodash-es/negate';
import * as styles from './styles.css';
import { Status } from './Reducer';
import { modes } from '../../../../commons/Constants';

interface MessageControllerProps {
  selectedMessages: any;
  currentMode: string;
  status: Status;
  searchTerm: string;
  searchDone: boolean;
  searchNotFound: boolean;
  toggleMode: (mode: string) => any;
  clearMessageSelections: () => any;
  applyChanges: () => any;
  openEmailSender: () => any;
  startSearch: (value: InputOnChangeData) => any;
  clearSearch: () => any;
  prevMatch: () => any;
  nextMatch: () => any;
}

class MessageController extends React.PureComponent<MessageControllerProps> {

  private open: boolean = false;
  private icon: SemanticICONS | undefined;
  private color: SemanticCOLORS = 'black';

  render() {
    const {
      currentMode,
      toggleMode,
      clearMessageSelections,
      applyChanges,
      selectedMessages,
      status,
      openEmailSender,
      startSearch,
      clearSearch,
      searchTerm,
      nextMatch,
      prevMatch,
      searchDone,
      searchNotFound,
    } = this.props;

    switch (status) {
      case Status.DISMISS:
        this.open = false;
        break;
      case Status.FAILURE:
        this.open = true;
        this.icon = 'remove';
        this.color = 'red';
        break;
      case Status.LOADING:
        this.open = true;
        this.icon = 'circle notched';
        break;
      case Status.SUCCESS:
        this.open = true;
        this.icon = 'checkmark';
        this.color = 'teal';
        break;
    }

    const selectedRequestMessageId = selectedMessages.REQUEST.map(
      (msg: { [key: string]: any }) =>
        msg.id,
    );

    const selectedResponseMessageId = selectedMessages.RESPONSE.map(
      (msg: { [key: string]: any }) =>
        msg.id,
    );

    return (
      <div>
        <Menu className={styles.optionMenu}>
          <Popup
            basic={true}
            position="bottom left"
            trigger={
              <Menu.Menu>
                <Menu.Item onClick={toggleMode.bind(null, modes.label)}>
                  <Icon
                    name="tags"
                    color={currentMode === modes.label ? 'green' : 'red'}
                  />
                </Menu.Item>
                <Menu.Item onClick={toggleMode.bind(null, modes.redirectToEmail)}>
                  <Icon
                    name="send"
                    color={currentMode === modes.redirectToEmail ? 'green' : 'red'}
                  />
                </Menu.Item>
              </Menu.Menu>
            }
            content="You can match question with answer, or redirect question to other department"
          />
          <Menu.Item>
            <Input
              icon={true}
              placeholder="Search..."
              onChange={rearg(startSearch, 1)}
              actionPosition="left"
              value={searchTerm}
              loading={!searchDone}
            >
              <Button
                compact={true}
                icon="chevron up"
                disabled={searchTerm === ''}
                onClick={nextMatch}
              />
              <Button
                compact={true}
                icon="chevron down"
                disabled={searchTerm === ''}
                onClick={prevMatch}
              />
              <input />
              <Icon
                name={searchTerm !== '' ? 'x' : 'search'}
                link={searchTerm !== ''}
                onClick={clearSearch}
              />
            </Input>
          </Menu.Item>
          {
            (() => {
              if (currentMode !== '') {
                const disabled =
                  currentMode === modes.label ? !every(selectedMessages, unary(negate(isEmpty))) :
                    currentMode === modes.redirectToEmail ? isEmpty(selectedMessages.REQUEST) :
                      false;

                return (
                  <Menu.Menu position="right">
                    <Popup
                      trigger={
                        <Menu.Item
                          onClick={clearMessageSelections}
                          disabled={every(selectedMessages, unary(isEmpty))}
                        >
                          <Icon name="square outline" />
                        </Menu.Item>}
                      content="Clear All Selection(s)"
                    />
                    <Popup
                      trigger={
                        <Menu.Item
                          disabled={disabled}
                          onClick={
                            disabled ?
                              undefined :
                              currentMode === modes.label ?
                                applyChanges.bind(
                                  null,
                                  currentMode, selectedRequestMessageId, selectedResponseMessageId,
                                ) :
                                currentMode === modes.redirectToEmail ?
                                  openEmailSender.bind(null) :
                                  () => console.log('no valid click action')
                          }
                        >
                          <Icon name="checkmark" color={disabled ? 'grey' : 'green'} />
                        </Menu.Item>}
                      content={
                        currentMode === modes.label ? 'Apply Change(s)' :
                          currentMode === modes.redirectToEmail ? 'mail to another department' :
                            ''
                      }
                    />
                    <Popup
                      trigger={
                        <Menu.Item onClick={toggleMode.bind(null, '')}>
                          <Icon name="remove" />
                        </Menu.Item>}
                      content="Cancel"
                    />
                  </Menu.Menu>
                );
              }
            })()
          }
        </Menu>
        <Transition visible={this.open}>
          <Portal open={true}>
            <Icon
              className={styles.portal}
              name={this.icon}
              circular={true}
              inverted={status !== Status.LOADING}
              color={this.color}
              size="huge"
              loading={status === Status.LOADING}
            />
          </Portal>
        </Transition>
        <TransitionablePortal
          transition={{ animation: 'fade', duration: 500 }}
          open={searchNotFound}
          closeOnDocumentClick={false}
          closeOnEscape={false}
        >
          <div>
            <Message floating={true} color="black" className={styles.searchMessage}>
              <Message.Header>Search not found</Message.Header>
            </Message>
          </div>
        </TransitionablePortal>
      </div>
    );
  }
}

export { MessageController, MessageControllerProps };
