# Workspace Engine — Philosophy

## Core Principle

> Applications provide features. Users decide how those features belong on their screen.

Workspace Engine is not a browser.
It is not a replacement for websites.
It is not trying to redesign applications.

Its purpose is to provide a lightweight organization layer that allows users to
decide how application features belong on their screen.

## What Workspace Engine Does

- Reorganizes existing functionality
- Preserves all original application behavior
- Presents reorganization options to the user
- Applies the user's choices
- Reverses them on request

## What Workspace Engine Does Not Do

- Modify how applications work
- Replace application features with alternatives
- Make layout decisions on the user's behalf
- Assume what the user wants
- Persist decisions the user did not make

## The Engine and the User

The engine suggests.
The user decides.

This is not a UX pattern. It is the product contract.
Every feature of Workspace Engine must respect this contract.
If a feature requires the engine to decide on the user's behalf, it does not
belong in Workspace Engine.

## Customization and Personalization

Customization is the mechanism.
Personalization is the outcome.

Workspace Engine provides the tools for customization.
The user's choices produce personalization.
The engine never personalizes on the user's behalf.

## The Adapter Model

The engine is platform-agnostic.
Adapters translate between the engine and specific applications.

The engine never references a DOM selector, a YouTube element, or any
platform-specific detail. That knowledge lives exclusively in adapters.
This boundary is permanent. It is not a convenience — it is the architecture.

## Why This Matters for Engineering

Every engineering decision in this project must be traceable back to the
core principle.

If a proposed feature makes the engine more opinionated about layout, it is
moving in the wrong direction.

If a proposed feature gives the user more control over layout, it is moving
in the right direction.