import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Segment, Container, Header, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { EditButton, MetadataTable } from '../../components';
import { document as documentApi } from '../../../../common/api';
import { BackOfficeRoutes, openRecordEditor } from '../../../../routes/urls';

const renderKeywords = keywords => {
  return (
    <List horizontal>
      {keywords.map(keyword => (
        <List.Item key={keyword.name}>
          <Link
            to={BackOfficeRoutes.documentsListWithQuery(
              documentApi
                .query()
                .withKeyword(keyword)
                .qs()
            )}
          >
            {keyword.name}
          </Link>
        </List.Item>
      ))}
    </List>
  );
};

export default class DocumentDetails extends Component {
  renderHeader = data => {
    return (
      <Grid.Row>
        <Grid.Column width={14} verticalAlign={'middle'}>
          <Header as="h1">
            Document #{data.document_pid} - {data.metadata.title}
          </Header>
        </Grid.Column>
        <Grid.Column width={2} textAlign={'right'}>
          <EditButton
            clickHandler={() =>
              openRecordEditor(documentApi.url, data.document_pid)
            }
          />
        </Grid.Column>
      </Grid.Row>
    );
  };

  prepareData = data => {
    const rows = [
      { name: 'Title', value: data.metadata.title },
      { name: 'Authors', value: data.metadata.authors },
    ];
    if (!isEmpty(data.metadata.keywords)) {
      rows.push({
        name: 'Keywords',
        value: renderKeywords(data.metadata.keywords),
      });
    }
    return rows;
  };

  render() {
    const { data } = this.props;
    return (
      <Segment className="document-metadata">
        <Grid padded columns={2}>
          {this.renderHeader(data)}
          <Grid.Row>
            <Grid.Column>
              <MetadataTable rows={this.prepareData(data)} />
            </Grid.Column>
            <Grid.Column>
              <Container>
                <Header as="h3">Abstract</Header>
                <p>{data.metadata.abstracts}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

DocumentDetails.propTypes = {
  data: PropTypes.oneOfType([
    () => null,
    PropTypes.shape({
      document_pid: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        abstracts: PropTypes.arrayOf(PropTypes.string).isRequired,
        authors: PropTypes.arrayOf(PropTypes.string).isRequired,
        title: PropTypes.string.isRequired,
        keywords: PropTypes.arrayOf(
          PropTypes.shape({
            keyword_pid: PropTypes.string,
            name: PropTypes.string,
          })
        ),
      }).isRequired,
    }).isRequired,
  ]).isRequired,
};