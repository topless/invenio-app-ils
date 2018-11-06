import React from 'react';
import { BookLoader } from 'common/components';

function ApiLoader(props) {
  return <BookLoader />;
}

export function withLoader(WrappedComponent) {
  return function WithLoader({ isLoading, ...props }) {
    return isLoading ? <ApiLoader /> : <WrappedComponent {...props} />;
  };
}
