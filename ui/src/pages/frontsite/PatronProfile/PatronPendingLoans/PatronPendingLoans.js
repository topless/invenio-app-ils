import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error, Pagination } from '@components';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Item,
  Modal,
  Popup,
} from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import { FrontSiteRoutes } from '@routes/urls';
import { DocumentAuthors, DocumentItemCover } from '@components/Document';
import { toShortDate } from '@api/date';
import { ILSItemPlaceholder } from '@components/ILSPlaceholder/ILSPlaceholder';
import { NoResultsMessage } from '../../components/NoResultsMessage';
import { ES_DELAY } from '@config';
import _get from 'lodash/get';

class LoanRequestListEntry extends Component {
  render() {
    const { loan } = this.props;
    return (
      <Item key={loan.metadata.pid} data-test={loan.metadata.pid}>
        <DocumentItemCover
          size="mini"
          document={loan.metadata.document}
          disabled
          linkTo={FrontSiteRoutes.documentDetailsFor(
            loan.metadata.document_pid
          )}
        />

        <Item.Content>
          <Item.Header
            as={Link}
            to={FrontSiteRoutes.documentDetailsFor(loan.metadata.document_pid)}
          >
            {loan.metadata.document.title}
          </Item.Header>
          <Grid columns={2}>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Item.Meta>
                <DocumentAuthors metadata={loan.metadata.document} />
                Requested on {toShortDate(loan.metadata.request_start_date)}
                <br />
                Valid until {toShortDate(loan.metadata.request_expire_date)}
                <Popup
                  content={
                    'If the request was not processed ' +
                    'before this date it will be invalidated'
                  }
                  trigger={<Icon name={'info'} />}
                />
              </Item.Meta>
              <Item.Description>
                {loan.metadata.document.circulation.has_items_on_site > 0 ? (
                  <>
                    You can also read it on-site only
                    <Popup
                      content={'Click on the cover to find the location'}
                      trigger={<Icon name={'info'} />}
                    />
                  </>
                ) : null}
              </Item.Description>
            </Grid.Column>
            <Grid.Column
              textAlign={'right'}
              mobile={16}
              tablet={8}
              computer={8}
            >
              <Item.Description>
                {loan.availableActions.cancel && (
                  <Button
                    size="small"
                    onClick={() => this.props.onCancelButton(loan)}
                  >
                    Cancel
                  </Button>
                )}
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    );
  }
}

LoanRequestListEntry.propTypes = {
  loan: PropTypes.object.isRequired,
  onCancelButton: PropTypes.func.isRequired,
};

export default class PatronPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronPendingLoans = this.props.fetchPatronPendingLoans;
    this.performLoanAction = this.props.performLoanAction;
    this.patronPid = this.props.patronPid;
    this.state = {
      activePage: 1,
      cancelModal: { isOpen: false, data: null },
    };
  }

  componentDidMount() {
    this.fetchPatronPendingLoans(this.patronPid, this.state.activePage, 5);
  }

  onPageChange = activePage => {
    this.fetchPatronPendingLoans(this.patronPid, activePage, 5);
    this.setState({ activePage: activePage });
  };

  renderList(data) {
    if (!isEmpty(data.hits)) {
      return (
        <>
          <Item.Group divided>
            {data.hits.map(entry => (
              <LoanRequestListEntry
                key={entry.metadata.pid}
                loan={entry}
                onCancelButton={this.showCancelModal}
              />
            ))}
          </Item.Group>
          <Container textAlign={'center'}>
            <Pagination
              currentPage={this.state.activePage}
              loading={this.props.isLoading}
              totalResults={this.props.data.total}
              onPageChange={this.onPageChange}
            />
          </Container>
        </>
      );
    }
    return (
      <NoResultsMessage
        messageHeader={'No loan requests'}
        messageContent={'Currently you do not have any loan requests'}
      />
    );
  }

  showCancelModal = loan => {
    this.setState({ cancelModal: { isOpen: true, data: loan } });
  };

  closeCancelModal = () => {
    this.setState({ cancelModal: { isOpen: false, data: undefined } });
  };

  onCancelRequestClick = () => {
    this.closeCancelModal();
    const loan = this.state.cancelModal.data;
    this.performLoanAction(
      _get(loan, 'availableActions.cancel'),
      _get(loan, 'metadata.document_pid'),
      this.patronPid,
      {
        item_pid: _get(loan, 'metadata.item_pid'),
        cancelReason: 'USER_CANCEL',
      }
    );
    setTimeout(() => {
      this.fetchPatronPendingLoans(this.patronPid, this.state.activePage, 5);
    }, ES_DELAY);
  };

  renderCancelModal() {
    return (
      <Modal
        open={this.state.cancelModal.isOpen}
        onClose={this.closeCancelModal}
        closeIcon
        size="small"
      >
        <Header
          icon="exclamation"
          content="Are you sure you want to cancel your request?"
        />
        <Modal.Content>
          Your loan request for "
          <strong>
            {_get(this.state.cancelModal.data, 'metadata.document.title')}
          </strong>
          " will be cancelled.
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.closeCancelModal}>No, take me back</Button>
          <Button negative onClick={() => this.onCancelRequestClick()}>
            Yes, I am sure
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderLoader = props => {
    return (
      <>
        <Item.Group>
          <ILSItemPlaceholder fluid {...props} />
          <ILSItemPlaceholder fluid {...props} />
        </Item.Group>
      </>
    );
  };

  render() {
    const { data, isLoading, error } = this.props;
    return (
      <Container className="spaced">
        <Header
          as={'h2'}
          content={'Your loan requests'}
          className={'highlight'}
          textAlign={'center'}
        />
        <Loader isLoading={isLoading} renderElement={this.renderLoader}>
          <Error error={error}>
            {this.renderList(data)}
            {this.renderCancelModal()}
          </Error>
        </Loader>
      </Container>
    );
  }
}

PatronPendingLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
