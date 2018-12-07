import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from 'common/components';
import { ItemMetadata } from '../';
import { ItemPendingLoans } from '../';

export default class ItemDetails extends Component {
  render() {
    const { isLoading, data, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <ItemMetadata />
          <ItemPendingLoans item={data} />
        </Error>
      </Loader>
    );
  }
}

ItemDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};