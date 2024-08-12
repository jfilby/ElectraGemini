# Electra

## Introduction

Electra is a web platform for empowering democractic teams with AI. These could
be political parties or businesses that would like to understand the issues
people face and what can be done about them.

Both issues and proposals are generated based on recent news events. Users can
then vote on proposals, so that teams can agree on how to best tackle the
various issues.


## Install

See the docs/install.md document for the installation steps.


## Create an admin user

Steps to create an admin user:
- Visit the home page of the web app and click Sign-in.
- Enter your email address and click the Sign-in button.
- A verification email will be sent to you, click the link in this email.
- You should now be signed-in.
- In the DB, identify the User record with your email address.
- Identify the user_profile record for the user_id found in the previous step.
- Update this record's is_admin field to true.


## Setup

In the web app, go to /admin/setup as a signed-in admin user. Check the
following checkboxes and click the Setup button:

- Create or update base and demo data.
- Deploy voting smart contract.

A success message should be shown to verifying that these actions were
successful.


## Blockchain

Proposals and votes are published to the specified blockchain network on a
regular basis by the batch. This is done by invoking a Solidity contract, which
is deployed as part of the setup.


## Batch

Electra includes a batch to carry out regular tasks:
- Downloading the latest news headlines/articles from newapi.org.
- Generating issues and proposals based on the latest news.
- Publishing new proposals and votes to the blockchain network.

The batch should be setup using a script that starts and restarts its process
(if necessary). Unhandled exceptions (e.g. from LLM providers) could terminate
the batch process.


## Running the client, server and batch

See the process watch script for details on how to start each process in
production.

For dev:
- client: `. scripts/dev.sh` and `npm run dev`
- server: `. scripts/dev.sh` and `npm run dev`
- batch: `. ../server/scripts/dev.sh` and `npm run ts-script`


## Tech stack

- Web framework: NextJS, TypeScript
  Next.js v14+ recommended

- Database: PostgreSQL
  v15+ recommended

- Blockchain: Ethereum compatible
  HardHat recommended for local dev

