---
eip: <EIP-XXXX>
title: ERC-721 Buyable & Royalties on-Chain for Decentralized Marketplaces
description: Allowing tokens to be buyable and enforce royalties directly on-Chain
author: Aubay <blockchain-team@aubay.com>, BOCA Jeabby (@bjeabby1507), EL MERSHATI Laith (@lth-elm), KEMP Elia (@eliakemp)
discussions-to: <URL>
status: Draft
type: Standard Track
category: ERC
created: 2022-05-17
requires: 721
---

## Abstract

This EIP allows an [ERC-721](/EIPS/eip-721) token to become buyable and to specifically enforce royalties as a percentage, directly on-chain, without entrusting a third-party. A decentralized marketplace can be built around this interface.

## Motivation

As of now, we expect marketplaces to voluntarily pay royalties “off-chain”. But this process is not yet widely adopted and relies on the marketplace being trustworthy. We have created an improvement proposal that automatically calculates & pays royalties on-chain for every token sold. On top of that, our improvement proposal allows the [ERC-721](/EIPS/eip-721) token to be financially tradeable in ETH on-chain without the need for marketplaces and the issues that comes with them: security, royalties not respected or limited.

## Specification

Deployer of the contract **MAY** override `_royaltyDenominator()` set by default to 10000=100%, meaning the rate is specified in basis points.

Deployer of the contract **MAY** override `_defaultRoyalty()` (by default to 1000=10% if `_royaltyDenominator()` in basis point) and set another default royalty at the contract creation. **Caution !** Deployer **SHALL NOT** set a royalty higher than value in `_royaltyDenominator()` (meaning royalty > 100%) or else errors will occurs during payments.

Deployer/Owner **MAY** choose to not collect any royalties by simply setting its value to 0;

Owner of the contract **MAY** update royalty in variable `_updatedRoyalty` with `setRoyalty()` and is **REQUIRED** to input a value strictly lower than the current one.

Token holder **MAY** set their token to sale with `setPrice()` and **MAY** remove it from sale with `removeTokenSale`.

Anyone **SHOULD** get access to the public `prices` of token Ids.

Through `royaltyInfo()` anyone **SHOULD** get access to the current royalty set in contract and the denominator associated with.

Anyone **MAY** buy a token on-chain via `buyToken()` if it is on sale, therefore they **SHOULD** enter a valid token Id that is for sale otherwise execution will revert.

Implementers of this standard **MUST** respect this interface:

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev Required interface of an ERC721Buyable compliant contract.
 * bytes4 private constant _INTERFACE_ID_ERC721Buyable = 0x8ce7e09d;
 */
interface IERC721Buyable is IERC721 {

    /**
     * @dev Emitted when `amount` of ether is transferred from `buyer` to `seller` when purchasing a token.
     */
    event Purchase(address indexed buyer, address indexed seller, uint indexed amount);

    /**
     * @dev Emitted when price of `tokenId` is set to `price`.
     */
    event UpdatePrice(uint indexed tokenId, uint indexed price);

    /**
     * @dev Emitted when `tokenId` is removed from the sale.
     */
    event RemoveFromSale(uint indexed tokenId);

    /**
     * @dev Emitted when royalty percentage is set to `royalty`.
     */
    event UpdateRoyalty(uint indexed royalty);


    /**
     * @notice Puts a token to sale and set its price.
     * @dev Requirements:
     *
     * - Owner of `_tokenId` must be the caller
     *
     * Emits an {UpdatePrice} event.
     *
     * @param _tokenId uint representing the token ID number.
     * @param _price uint representing the price at which to sell the token.
     */
    function setPrice(uint _tokenId, uint _price) external;

    /**
     * @notice Removes a token from the sale.
     * @dev Requirements:
     *
     * - Owner of `_tokenId` must be the caller
     *
     * Emits a {RemoveFromSale} event.
     *
     * @param _tokenId uint representing the token ID number.
     */
    function removeTokenSale(uint _tokenId) external;

    /**
     * @notice Buys a specific token from its ID onchain.
     * @dev Amount of ether msg.value sent is transferred to `seller` of the token.
     * A percentage of the royalty allocution is sent to `_owner` of the contract.
     * The token of ID `_tokenId` is then transferred from `seller` to `buyer` (the msg.sender).
     * The token is then automatically removed from the sale.
     *
     * Requirements:
     *
     * - `_tokenId` must be put to sale
     * - Amount of ether `msg.value` sent must be greater than the selling price
     *
     * Emits a {Purchase} event.
     *
     * @param _tokenId uint representing the token Id number.
     */
    function buyToken(uint _tokenId) external payable;


    /**
     * @notice Return the current royalty and its denominator.
     * @dev Return the current royalty and its denominator.
     * @return _royalty uint within the range of `_royaltyDenominator` associated with the token.
     * @return _denominator uint denominator set in `_royaltyDenominator()`.
     */
    function royaltyInfo() external view returns(uint, uint);

    /**
     * @notice Set the royalty percentage.
     * @dev Set or update the royalty percentage within the range of `_royaltyDenominator`.
     * Update the `_firstRoyaltyUpdate` boolean to true if previously false.
     *
     * Requirements:
     *
     * - caller must be `_owner` of the contract
     * - `_newRoyalty` must be between 0 and `_royaltyDenominator`
     * - `_newRoyalty` must be lower than current previous one
     *
     * Emits an {UpdateRoyalty} event.
     *
     * @param _newRoyalty uint within the range of `_royaltyDenominator` as new tokens royalties.
     */
    function setRoyalty(uint _newRoyalty) external;
}
```

To create and deploy an ERC721Buyable contract one **MAY** only inherit directly from this [ERC-721](/EIPS/eip-721) extension that would directly signal support for ERC721Buyable:

```javascript
pragma solidity ^0.8.0;
import "./ERC721Buyable.sol";

contract NFTContract is ERC721Buyable {
    // ...
    constructor() ERC721("NFTBuyableContract", "NFTBC") { }
    // ...
}
```

Checking if a contract implement this specification can be done with:

```javascript
import "./interfaces/IERC721Buyable.sol";

function isERCBuyable(IERC721Buyable _contractAddr) internal view returns(bool) {
    (bool success) = IERC165(_contractAddr).supportsInterface(type(IERC721Buyable).interfaceId);
    return success;
}

// OR

bytes4 private constant _INTERFACE_ID_ERC721Buyable = 0x8ce7e09d;

function isIDERCBuyable(address _contractAddr) internal view returns(bool) {
    (bool success) = IERC165(_contractAddr).supportsInterface(_INTERFACE_ID_ERC721Buyable);
    return success;
}
```

### Functions

#### **supportsInterface**

Returns true if a contract implements the interface defined by `interfaceId`.

| Parameter   | Description                                              |
| ----------- | -------------------------------------------------------- |
| interfaceId | bytes4 representing the support of a contract interface. |

#### **setPrice**

Puts a token to sale and sets its price.

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| \_tokenId | uint representing the token ID number.                  |
| \_price   | uint representing the price at which to sell the token. |

#### **removeTokenSale**

Removes a token from the sale.

| Parameter | Description                            |
| --------- | -------------------------------------- |
| \_tokenId | uint representing the token ID number. |

#### **buyToken**

Buys a specific token from its ID onchain.

| Parameter | Description                            |
| --------- | -------------------------------------- |
| \_tokenId | uint representing the token ID number. |

#### **\_royaltyDenominator**

The denominator to interpret the rate of royalties, defaults to 10000 so rate are expressed in basis points. _May be customized with an override._

#### **\_defaultRoyalty**

Royalty percentage per default at the contract creation expressed in basis points (between 0 and `_royaltyDenominator` and 1000 per default).

#### **\_royalty**

Return the current royalty without its denominator.

#### **royaltyInfo**

Return the current royalty and its denominator.

#### **setRoyalty**

Set the royalty percentage.

| Parameter    | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| \_newRoyalty | uint within the range of `_royaltyDenominator` as new tokens royalties. |

#### **\_payRoyalties**

Send to `_owner` of the contract a specific amount of ether as royalties.

| Parameter | Description                   |
| --------- | ----------------------------- |
| \_amount  | uint for the royalty payment. |

## Rationale

- Fully on-chain transaction condition

We wanted to make it possible for a token to be sold and buyable within its own contract so that their holders don't have to interact with any other third parties and take the risk of being affected by a vulnerability within the selling condition as it was recently seen with Opensea that had their marketplace conduct off-chain listing in order to save gas. A middleman (whether on-chain or off-chain) sometimes adds unnecessary extra steps + approvals when the blockchain actually allows direct peer-to-peer exchanges with total trust thanks to the conditions written in the smart-contract.

- Royalties matter

Regarding the royalties payment, NFT creators rely on marketplaces like OpenSea & Rarible to collect it when their creations are sold. Over time, we discussed the idea of making this entire process completely decentralised. With such solution, artists would be allowed to 100% enforce their due royalties without taking the risk of trusting a marketplace to pay them directly nor having to specify to each marketplace one by one the % they want to collect while being constrained to be capped. Our solution by being able to directly sell a token onchain makes it easy to do just that.

Although we considered integrating this option in another extension, we ultimately felt it was more appropriate to include it here while giving the creator the option to not apply any royalties (override `_defaultRoyalty()` and set the value to 0).

To avoid any mischievous manipulation we decided that is not possible to increase the royalty % once the contract is deployed but only to decrease it under its current value.

- Other considerations

We have considered implementing a paymentSplitter option at the moment of the royalty payment as it can be useful for a large team but we felt that it was out of place here and would make the standard more cumbersome for nothing. Indeed, a team could just override few functions to adapt it to their use case or just use other solutions such as multisigs.

We had first created a mapping that records whether a token is for sale or not along with the one that associates a token to its price, finally we thought that the second one is enough. Indeed, if a token is associated to a non zero price then it is for sale, otherwise not (price at 0).

- Extend compatibility

If this proposal gets approved, we can definitely create an extension for both [ERC-1155](/EIPS/eip-1155) and ERC721A which is becoming more and more popular among developers as they begin to adopt this new form of standard.

Other aspects could also be integrated such as the support for auctions and/or extension with an operator filter registry model like the Opensea one.

## Backwards Compatibility

There are no backward compatibility issues, this implementation is an extension of the functionality of ERC-721 from [EIP-721](/EIPS/eip-721). This EIP is fully backward compatible and introduces new functionality retaining the core interfaces and functionality of the [ERC-721 standard](/EIPS/eip-721).

## Test Cases

Tests can be found under [test/](./test/) folder.

## Reference Implementation

Contract implementation can be found under [contracts/](./contracts/) folder and Dapp integration example under [client/](./client/).

## Security Considerations

There are no security considerations related directly to the implementation of this standard. Discussion with reviewers can still be found at <URL>.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE.md).
