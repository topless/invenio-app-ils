import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  Loader,
  Error,
  Pagination,
} from '../../../../common/components';
import {toShortDate} from '../../../../common/api/date';
import {invenioConfig} from '../../../../common/config';
import {
  Container,
  Grid,
  Header,
  Item,
  Label, Message,
} from "semantic-ui-react";
import {getCover} from "../../config";
import {Link} from "react-router-dom";
import {FrontSiteRoutes} from "../../../../routes/urls";
import {DocumentAuthors} from "../../components/Document";
import isEmpty from "lodash/isEmpty";
import { DateTime } from "luxon";
import {ILSItemPlaceholder} from
    "../../../../common/components/ILSPlaceholder/ILSPlaceholder";


class LoanListEntry extends Component {

  render() {
    const {loan} = this.props;
    const now = DateTime.local();
    const is_loan_overdue = loan.metadata.end_date < now;
    return (
      <Item className={is_loan_overdue ? 'bkg-danger' : ''}
            key={loan.metadata.pid}>
        <Item.Image size='mini'
                    src={getCover(loan.metadata.document_pid)}
                    as={Link}
                    to={FrontSiteRoutes.documentDetailsFor(
                      loan.metadata.document_pid)}
        />

        <Item.Content>
          <Item.Header as={Link}
                       to={FrontSiteRoutes.documentDetailsFor(
                         loan.metadata.document_pid)}>
            {loan.metadata.document.title}</Item.Header>
          <Grid columns={2}>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Item.Meta>
                <DocumentAuthors metadata={loan.metadata.document}/>
                Loaned on {toShortDate(loan.metadata.start_date)}
              </Item.Meta>
              <Item.Description>
                {}
                You have extended this loan {loan.metadata.extension_count}
                {' '}of {invenioConfig.loans.maxExtensionsCount} times
              </Item.Description>
            </Grid.Column>
            <Grid.Column textAlign={'right'}
                         mobile={16} tablet={8} computer={8}>
              <Item.Description>
                Please return the literature before date{' '}
                <Label className={'bkg-primary'}>
                  {toShortDate(loan.metadata.end_date)}
                </Label><br/>
                {is_loan_overdue ?
                  'Your loan is overdue. Please return the book ' +
                  'as soon as possible' : null}
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    )
  }
}

export default class PatronCurrentLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronCurrentLoans = this.props.fetchPatronCurrentLoans;
    this.patronPid = this.props.patronPid;
    this.state = {activePage: 1};
  }

  componentDidMount() {
    this.fetchPatronCurrentLoans(this.patronPid, this.state.activePage, 5);
  }

  onPageChange = activePage => {
    this.fetchPatronCurrentLoans(this.patronPid, activePage, 5);
    this.setState({activePage: activePage});
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        currentSize={invenioConfig.defaultResultsSize}
        loading={this.props.isLoading}
        totalResults={this.props.data.total}
        onPageChange={this.onPageChange}
      />
    );
  };

  renderList(data) {
    if (!isEmpty(data.hits)) {
      return (
        <>
          <Item.Group divided>{data.hits.map(entry =>
            <LoanListEntry key={entry.metadata.pid} loan={entry}/>
          )}</Item.Group>
          <Container textAlign={'center'}>
            {this.paginationComponent()}
          </Container>
        </>
      )
    }
    return (<Message className={'info'} data-test={'no-results'}>
      <Message.Header>No loan requests</Message.Header>
      <p>Currently you do not have any loan requests</p>
    </Message>)
  }

  renderLoader = (props) => {
    return (
      <>
        <Item.Group>
          <ILSItemPlaceholder fluid {...props}/>
          <ILSItemPlaceholder fluid {...props}/>
        </Item.Group>
      </>
    )
  };


  render() {
    const {data, isLoading, error} = this.props;
    return (
      <Container className={'spaced'}>
        <Header as={'h2'}
                content={"Your current loans"}
                className={'highlight'}
                textAlign={'center'}
        />
        <Loader isLoading={isLoading} renderElement={this.renderLoader}>
          <Error error={error}>
            {this.renderList(data)}
          </Error>
        </Loader>
      </Container>

    );
  }
}

PatronCurrentLoans.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};