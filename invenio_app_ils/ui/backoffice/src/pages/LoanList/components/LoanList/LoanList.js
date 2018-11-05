import React, { Component } from 'react';
import { compose } from 'redux';
import { Container } from 'semantic-ui-react';
import { LoanTable } from '../LoanTable/LoanTable';
import { withLoader, withError } from 'common/hoc';

const EnchancedTable = compose(
  withError,
  withLoader
)(LoanTable);

export class LoanList extends Component {
  render() {
    return (
      <Container>
        <h1>Loans</h1>
        <EnchancedTable {...this.props} />
      </Container>
    );
  }
}
