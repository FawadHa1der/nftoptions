import React from 'react'
import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Flex as="footer" width="full" align="center">
            <Text>
                <Link
                    textDecoration="none !important"
                    outline="none !important"
                    boxShadow="none !important"
                    href="https://github.com/FawadHa1der/nftoptions"
                    isExternal
                >
                    github
                </Link>
            </Text>
        </Flex>
    );
};

export default Footer;