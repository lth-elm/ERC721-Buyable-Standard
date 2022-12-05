// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Buyable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTContract is ERC721Buyable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    mapping(uint256 => Attr) public attributes;

    struct Attr {
        string name;
        uint256 level;
    }

    constructor() ERC721("NFTContract", "NFTC") {}

    function mint() external returns (uint256) {
        require(supply.current() < 3, "Max supply exceeded");
        supply.increment();

        attributes[supply.current()] = Attr(
            string(abi.encodePacked("ETH NFT #", supply.current().toString())),
            supply.current()
        );

        _safeMint(msg.sender, supply.current());

        return supply.current();
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function burn(uint256 _tokenId) external onlyTokenOwner(_tokenId) {
        _burn(_tokenId);
    }

    function getSvg(uint256 _tokenId) private pure returns (string memory) {
        string memory base = "data:image/svg+xml;base64,";
        if (_tokenId == 1) {
            string memory svgBase64Encoded = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            "<svg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%' preserveAspectRatio='xMidYMid' viewBox='-38.39985 -104.22675 332.7987 625.3605'><path fill='#343434' d='M125.166 285.168l2.795 2.79 127.962-75.638L127.961 0l-2.795 9.5z'/><path fill='#8C8C8C' d='M127.962 287.959V0L0 212.32z'/><path fill='#3C3C3B' d='M126.386 412.306l1.575 4.6L256 236.587l-128.038 75.6-1.575 1.92z'/><path fill='#8C8C8C' d='M0 236.585l127.962 180.32v-104.72z'/><path fill='#141414' d='M127.961 154.159v133.799l127.96-75.637z'/><path fill='#393939' d='M127.96 154.159L0 212.32l127.96 75.637z'/></svg>"
                        )
                    )
                )
            );
            return string(abi.encodePacked(base, svgBase64Encoded));
        } else if (_tokenId == 2) {
            string memory svgBase64Encoded = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            "<svg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%' viewBox='-161.97 -439.65 1403.74 2637.9'><path fill='#8A92B2' d='M539.7 650.3V0L0 895.6z'/><path fill='#62688F' d='M539.7 1214.7V650.3L0 895.6zm0-564.4l539.8 245.3L539.7 0z'/><path fill='#454A75' d='M539.7 650.3v564.4l539.8-319.1z'/><path fill='#8A92B2' d='M539.7 1316.9L0 998l539.7 760.6z'/><path fill='#62688F' d='M1079.8 998l-540.1 318.9v441.7z'/></svg>"
                        )
                    )
                )
            );
            return string(abi.encodePacked(base, svgBase64Encoded));
        } else if (_tokenId == 3) {
            string memory svgBase64Encoded = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            "<svg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%' viewBox='-107.3421 -298.5 930.2982 1791'><g fill-rule='evenodd' fill='none'><path fill='#5A9DED' d='M357.2 901.161l358.414-224.965L357.2 1194zm53.295 29.281v93.57L525.27 858.259z'/><path fill='#D895D3' d='M393.88 433.792L658.468 583.49l-26.098 46.129-264.588-149.697z'/><path fill='#FF9C92' d='M357.2 0l357.2 614.809-357.2 225.29zm52.675 196.753v547.82l233.291-147.14z'/><path fill='#53D3E0' d='M358.414 901.161L0 676.196 358.414 1194zm-53.295 29.281v93.57L190.345 858.259z'/><path fill='#A6E275' d='M310.588 438.79L46 588.487l26.1 46.129 264.588-149.697z'/><path fill='#FFE94D' d='M357.2 0L0 614.809l357.2 225.29zm-52.675 196.753v547.82L71.234 597.434z'/></g></svg>"
                        )
                    )
                )
            );
            return string(abi.encodePacked(base, svgBase64Encoded));
        }
        return "";
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(_tokenId), "URI query for nonexistent token");

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        attributes[_tokenId].name,
                        '",',
                        '"description": "ETH Stones",',
                        '"image_data": "',
                        getSvg(_tokenId),
                        '",',
                        '"attributes": [{"trait_type": "Level", "value": ',
                        (attributes[_tokenId].level).toString(),
                        "}",
                        "]}"
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
}
