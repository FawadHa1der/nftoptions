
import { useForm } from "react-hook-form";
import React from "react";
import { FormErrorMessage, FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import { number } from "starknet";
import { useRouter } from "next/router";
import { NFTData } from "./NFTData";

export interface IPutOption {
    strike_price: string;
    premium: string;
    expiry_date: string;
}

interface IPutOptionFormProps {
    onRegistered: (data: IPutOption) => void;
    nftdata: NFTData | undefined;
}

export default function PutOptionForm({ onRegistered, nftdata }: IPutOptionFormProps) {
    const {
        handleSubmit, // handels the form submit event
        register, // ties the inputs to react-form
        formState: { errors, isSubmitting }, // gets errors and "loading" state
    } = useForm<IPutOption>();

    const router = useRouter();
    // const pic = router.query;
    const pic = nftdata;

    return (
        <form onSubmit={handleSubmit(onRegistered)} noValidate>
            {/* noValidate will stop the browser validation, so we can write our own designs and logic */}
            <FormControl >
                <FormLabel >
                    Token ID {pic?.token_id}
                    {/* the form label from chakra ui is tied to the input via the htmlFor attribute */}
                </FormLabel>
            </FormControl >
            <FormControl isInvalid={!!errors.strike_price ? true : false} >
                <FormLabel htmlFor="strike_price">
                    Strike Price in ETH
                    {/* the form label from chakra ui is tied to the input via the htmlFor attribute */}
                </FormLabel>

                {/* you should use the save value for the id and the property name */}
                <Input
                    id="strike_price"
                    placeholder="100"
                    {
                    ...register("strike_price", {
                        required: "Please enter the strike price for your NFT",
                    }) /* this register function will take care of the react-form binding to the ui */
                    }
                ></Input>
                {/* react-form will calculate the errors on submit or on dirty state */}
                <FormErrorMessage>{errors.strike_price && errors?.strike_price?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.premium ? true : false}>
                <FormLabel htmlFor="premium">
                    Premium in ETH
                </FormLabel>
                <Input
                    id="premium"
                    placeholder="50"
                    {...register("premium", {
                        required: "please enter premium you are willing to pay?",
                    })}
                ></Input>
                <FormErrorMessage>{errors.premium && errors?.premium?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.expiry_date ? true : false}>
                <FormLabel htmlFor="expiry_date">Expiry Date</FormLabel>
                <Input id="expiry_date" type="datetime-local"
                    {...register("expiry_date", {
                        required: "please enter the expiry_date?",
                    })} />
                Expiry date
            </FormControl>
            <Button mt={10} colorScheme="blue" isLoading={isSubmitting} type="submit" >
                Register your PUT 🐱‍🏍
            </Button>
        </form>
    );
}
