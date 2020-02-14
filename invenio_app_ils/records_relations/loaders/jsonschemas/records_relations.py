# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2019 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Relations Sequence schema for marshmallow loader."""

from invenio_records_rest.schemas import RecordMetadataSchemaJSONV1
from marshmallow import EXCLUDE, fields


class RelationParentChildV1(RecordMetadataSchemaJSONV1):
    """Relation ParentChind schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    parent_pid = fields.Str(required=True)
    parent_pid_type = fields.Str(required=True)
    child_pid = fields.Str(required=True)
    child_pid_type = fields.Str(required=True)
    relation_type = fields.Str(required=True)
    volume: fields.Str()


class RelationSiblingsV1(RecordMetadataSchemaJSONV1):
    """Relation Siblings schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    pid = fields.Str(required=True)
    pid_type = fields.Str(required=True)
    relation_type = fields.Str(required=True)
    note = fields.Str()


class RelationSequenceV1(RecordMetadataSchemaJSONV1):
    """Relation Sequence schema."""

    class Meta:
        """Meta attributes for the schema."""

        unknown = EXCLUDE

    next_pid = fields.Str(required=True)
    next_pid_type = fields.Str(required=True)
    previous_pid = fields.Str(required=True)
    previous_pid_type = fields.Str(required=True)
    relation_type = fields.Str(required=True)
