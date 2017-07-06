# 4. replace file hosting with cloud storage

Date: 2017-07-06

## Status

Accepted

## Context

The container host the output file for consuming applications.
If the container is not running, the file is not available.

## Decision

The `gp-data.json` file will be written to the team's preferred cloud hosting platform, enabling the gp data to be used in consuming applications.

The nginx server will be removed, simplifying deployment to a container running a single service.

## Consequences

A `gp-data.json` file will be available in cloud storage for use by consuming applications.

The nginx service will be removed.
