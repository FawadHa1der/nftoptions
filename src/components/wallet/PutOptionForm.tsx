
import { useForm } from "react-hook-form";
import React from "react";
import { FormErrorMessage, FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
import { number } from "starknet";
import { useRouter } from "next/router";
import { NFTData, PutData } from "./NFTData";


// this is used locally and not to be confused with PutData defined in NFTData.tsx
export interface IPutOptionForm {
    strike_price: string;
    premium: string;
    expiry_date: string;
    //formType: PutOptionFormType
}

export enum PutOptionFormType {
    CREATE = 1,
    YOUR_OPEN_BID = 2,
    OPEN_BIDS = 3,
    ACTIVE_BIDS_EXERCISABLE = 4, // if the user is the buyer
    ACTIVE_BIDS_SOLD = 5, //if the user is the seller
    CLOSED_BIDS = 6
}

export interface IPutOptionFormProps {
    onRegistered: (data: IPutOptionForm) => void;
    nftdata: NFTData | undefined;
    putdata: PutData | undefined;
    formType: PutOptionFormType | undefined;
}

export default function PutOptionForm({ onRegistered, nftdata, putdata, formType }: IPutOptionFormProps) {
    const {
        handleSubmit, // handels the form submit event
        register, // ties the inputs to react-form
        formState: { errors, isSubmitting }, // gets errors and "loading" state
    } = useForm<IPutOptionForm>();

    const router = useRouter();
    // const pic = router.query;
    const pic = nftdata;
    let formButtonText = ''
    let strikePricePlaceHolder = '100'
    let premiumPlaceHolder = '4'
    let datePlaceHolder = new Date(Date.now())

    if (!!putdata) {
        strikePricePlaceHolder = putdata.strike_price.toString()
        premiumPlaceHolder = putdata.premium.toString()
        datePlaceHolder = new Date(parseInt(putdata.expiry_date))
    }
    if (formType == PutOptionFormType.YOUR_OPEN_BID) {
        formButtonText = 'Cancel your bid'
    }
    else if (formType == PutOptionFormType.OPEN_BIDS) {
        formButtonText = 'Sell the put option'
    }
    else if (formType == PutOptionFormType.ACTIVE_BIDS_EXERCISABLE) {
        formButtonText = 'Exercise your bid'
    }
    else if (formType == PutOptionFormType.ACTIVE_BIDS_SOLD) {
        formButtonText = 'Cannot settle yet'
    }
    else if (formType == PutOptionFormType.CLOSED_BIDS) {
        formButtonText = ''
    }
    else {
        formButtonText = 'Register your PUT 🐱‍🏍'
    }

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
                    Strike Price in Test Token
                    {/* the form label from chakra ui is tied to the input via the htmlFor attribute */}
                </FormLabel>

                {/* you should use the save value for the id and the property name */}
                <Input
                    id="strike_price"
                    //placeholder={strikePricePlaceHolder}
                    {
                    ...register("strike_price", {
                        required: "Please enter the strike price for your NFT",
                    }) /* this register function will take care of the react-form binding to the ui */
                    }
                    disabled={formType != PutOptionFormType.CREATE}
                    defaultValue={strikePricePlaceHolder}
                ></Input>
                {/* react-form will calculate the errors on submit or on dirty state */}
                <FormErrorMessage>{errors.strike_price && errors?.strike_price?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.premium ? true : false}>
                <FormLabel htmlFor="premium">
                    Premium in Test Token
                </FormLabel>
                <Input
                    id="premium"
                    placeholder={premiumPlaceHolder}
                    {...register("premium", {
                        required: "please enter premium you are willing to pay?",
                    })}
                    defaultValue={premiumPlaceHolder}
                    disabled={formType != PutOptionFormType.CREATE}

                ></Input>
                <FormErrorMessage>{errors.premium && errors?.premium?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.expiry_date ? true : false}>
                <FormLabel htmlFor="expiry_date">Expiry Date</FormLabel>
                <Input id="expiry_date" type="datetime-local"
                    {...register("expiry_date", {
                        required: "please enter the expiry_date?",
                    })}
                    disabled={formType != PutOptionFormType.CREATE}
                    defaultValue={datePlaceHolder.toLocaleDateString()}
                />
            </FormControl>
            <FormLabel hidden={formType == PutOptionFormType.CREATE}>
                Buyer Address {putdata?.buyer_address}
                {/* the form label from chakra ui is tied to the input via the htmlFor attribute */}
            </FormLabel>
            <FormLabel hidden={(formType == PutOptionFormType.CREATE) || (formType == PutOptionFormType.YOUR_OPEN_BID) || (formType == PutOptionFormType.OPEN_BIDS)}>
                Seller Address {putdata?.seller_address}
                {/* the form label from chakra ui is tied to the input via the htmlFor attribute */}
            </FormLabel>

            <Button mt={10} colorScheme="blue" isLoading={isSubmitting} type="submit" disabled={formType == PutOptionFormType.ACTIVE_BIDS_SOLD}>
                {formButtonText}
            </Button>
        </form >
    );
}
