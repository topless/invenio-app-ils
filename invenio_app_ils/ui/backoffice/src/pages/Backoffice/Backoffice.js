import React, { Component } from 'react';
import { BookLoader } from 'common/components';

export class Backoffice extends Component {
  render() {
    return (
      <div>
        <h1>Backoffice main page</h1>
        <BookLoader />
      </div>
    );
  }
}
