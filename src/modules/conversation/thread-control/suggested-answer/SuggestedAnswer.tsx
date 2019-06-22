import * as React from 'react';
import { Dimmer, Loader, Modal, List, Button, Divider, Header } from 'semantic-ui-react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { change } from 'redux-form';
import map from 'lodash-es/map';
import isEmpty from 'lodash-es/isEmpty';

import * as styles from './styles.css';

export interface SuggestedAnswerProps {
  suggestionIndex: any;
  suggestions: string[];
  message: {[key: string]: any};
  status: {
    open: boolean;
    loading: boolean;
  };
  selectedConversation: any;

  selectSuggestion(): any;
  closeSuggestionModal(): any;
}

// tslint:disable max-line-length
export class SuggestedAnswer extends React.PureComponent<SuggestedAnswerProps> {
  render() {
    const {
      suggestionIndex,
      message,
      suggestions,
      selectSuggestion,
      status,
      closeSuggestionModal,
      selectedConversation,
    } = this.props;

    return (
      <Modal
        open={status.open}
        basic={true}
      >
        <Modal.Header>Suggestion Selector</Modal.Header>
        <Modal.Content as={Dimmer.Dimmable} dimmed={status.loading} blurring={true}>
          <Dimmer active={status.loading}>
            <Loader content="Loading" />
          </Dimmer>
          <Modal.Description>
            <Header
              inverted={true}
              icon="commenting outline"
              content={`User Message:  ${message.msg}`}
            />
          </Modal.Description>
          { isEmpty(suggestions[message.msgId])
            ? <Header
              icon="warning"
              content="No default suggestion for this message. Go to the editor to suggest some."
              inverted={true}
              textAlign="center"
            />
            : <Header
              content="Select the most appropriate answer"
              inverted={true}
              size="small"
            />
          }
          {map(suggestions[message.msgId], (suggest: {[key: string]: any}, index: number) => {
            return (
              <List selection={true} inverted={true} key={'suggestionsFor' + index + 'thMsg'}>
                <Divider/>
                <List.Item
                  icon="question"
                  key={'MODAL_' + index + suggest.question}
                  content={suggest.question}
                />
                <List.Item
                  icon="reply"
                  key={'MODAL_' + index + suggest.answer}
                  content={suggest.answer}
                  onClick={selectSuggestion.bind(null, suggest.answer)}
                />
              </List>
            );
          })}
        </Modal.Content>
        <Modal.Actions>
          <Button icon="remove" content="Cancel" onClick={closeSuggestionModal} />
        </Modal.Actions>
      </Modal>
    );
  }
}
