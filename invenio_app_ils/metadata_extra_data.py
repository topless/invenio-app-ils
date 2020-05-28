# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Extra data for metadata."""

from copy import deepcopy

from flask import current_app
from invenio_records_rest.schemas.fields import DateString, SanitizedUnicode
from marshmallow import Schema
from marshmallow.fields import Bool, Integer, List


class MetadataExtraData(object):
    """Custom helper class for metadata extra data."""

    def __init__(self, extra_data):
        """Constructor.

        :param extra_data: ExtraData dict
        """
        self.extra_data = deepcopy(extra_data) or {}
        self._validate()

    def _validate_marshmallow_type(self, field_cfg):
        """Make sure the Marshmallow type is one we support."""
        def validate_basic_marshmallow_type(_type):
            allowed_types = (
                Bool, DateString, Integer, SanitizedUnicode
            )
            assert isinstance(_type, allowed_types)

        marshmallow_type = field_cfg['marshmallow']
        if isinstance(marshmallow_type, List):
            validate_basic_marshmallow_type(marshmallow_type.inner)
        else:
            validate_basic_marshmallow_type(marshmallow_type)

    def _validate_elasticsearch_type(self, field_cfg):
        """Make sure the Elasticsearch type is one we support."""
        allowed_types = [
            'boolean', 'date', 'long', 'keyword', 'text'
        ]
        assert field_cfg['elasticsearch'] in allowed_types

    def _validate(self):
        """Validates extra_data configuration."""

        rec_types = self.extra_data.keys()
        # NOTE: document, series or nothing in 'prefixes'

        for rec_type, rec_config in self.extra_data.items():
            for prop_key, prop_value in rec_config.items():
                for field_key, field_cfg in prop_value.items():
                    self._validate_marshmallow_type(field_cfg)
                    self._validate_elasticsearch_type(field_cfg)

    def to_schema(self):
        """Dynamically creates and returns the extra_data Schema."""
        for rec_type, rec_config in self.extra_data.items():
            for prop_key, prop_value in rec_config.items():
                schema_dict = {
                    field_key: field_cfg['marshmallow']
                    for field_key, field_cfg in prop_value.items()
                }
        return Schema.from_dict(schema_dict)
