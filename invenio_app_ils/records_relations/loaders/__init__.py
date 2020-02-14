# -*- coding: utf-8 -*-
#
# Copyright (C) 2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""ILS records relations loaders."""

from invenio_app_ils.records.loaders import ils_marshmallow_loader

from .jsonschemas.records_relations import RelationParentChildV1, \
    RelationSequenceV1, RelationSiblingsV1

relations_parent_child_loader = ils_marshmallow_loader(RelationParentChildV1)
relations_siblings_loader = ils_marshmallow_loader(RelationSiblingsV1)
relations_sequence_loader = ils_marshmallow_loader(RelationSequenceV1)
