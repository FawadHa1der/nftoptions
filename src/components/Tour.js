import React, { useReducer, useEffect } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import Button from "./common/Button";

const TOUR_STEPS = [
    {
        target: "body",
        content: (
            <div>
                First get some <a href="https://faucet.goerli.starknet.io/">ETH tokens</a> for fee purposes
            </div>
        ),
        disableBeacon: true, // This makes the tour to start automatically without clicking
        placement: "center"
    },
    {
        target: "body",
        content: (
            <div>
                Get a lot of  <a href="https://argentlabs.github.io/argent-x/">TT tokens</a> which will simulate USD
            </div>
        ),
        placement: "center"
    },
    {
        target: "body",
        content: (
            <div>
                Buy or create some NFTs via <a href="https://testnet.aspect.co">Aspect</a>
            </div>
        ),
        placement: "center"
    },
    {
        target: "body",
        content: "Place a bid for your PUT by selecting the NFT in the gallery and pressing the buy PUT button",
        placement: "center"
    },
    {
        target: "body",
        content: "You can sell a PUT by selecting the NFT from the Sell Gallery and pressing the sell PUT button",
        placement: "center"

    },
];

const INITIAL_STATE = {
    key: new Date(), // This field makes the tour to re-render when we restart the tour
    run: false,
    continuous: true,
    loading: false,
    stepIndex: 0,
    steps: TOUR_STEPS
};

// Reducer will manage updating the local state
const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "START":
            return { ...state, run: true };
        case "RESET":
            return { ...state, stepIndex: 0 };
        case "STOP":
            return { ...state, run: false };
        case "NEXT_OR_PREV":
            return { ...state, ...action.payload };
        case "RESTART":
            return {
                ...state,
                stepIndex: 0,
                run: true,
                loading: false,
                key: new Date()
            };
        default:
            return state;
    }
};

// Tour component
const Tour = () => {
    // Tour state is the state which control the JoyRide component
    const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        // Auto start the tour if the tour is not viewed before
        if (!localStorage.getItem("tour")) {
            dispatch({ type: "START" });
        }
    }, []);

    // Set once tour is viewed, skipped or closed
    const setTourViewed = () => {
        localStorage.setItem("tour", "1");
    };

    const callback = data => {
        const { action, index, type, status } = data;

        if (
            // If close button clicked, then close the tour
            action === ACTIONS.CLOSE ||
            // If skipped or end tour, then close the tour
            (status === STATUS.SKIPPED && tourState.run) ||
            status === STATUS.FINISHED
        ) {
            setTourViewed();
            dispatch({ type: "STOP" });
        } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            // Check whether next or back button click and update the step.
            dispatch({
                type: "NEXT_OR_PREV",
                payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) }
            });
        }
    };

    const startTour = () => {
        // Start the tour manually
        dispatch({ type: "RESTART" });
    };

    return (
        <>
            <Button
                ml={2}
                onClick={() => {
                    startTour()
                }}
                label="Start tour"
            />

            <JoyRide
                {...tourState}
                callback={callback}
                showSkipButton={true}
                styles={{
                    buttonBack: {
                        marginRight: 10
                    },
                    options: {
                        arrowColor: '#e3ffeb',
                        backgroundColor: '#e3ffeb',
                        overlayColor: 'rgba(79, 26, 0, 0.4)',
                        primaryColor: '#000',
                        textColor: '#004a14',
                        width: 400,
                        zIndex: 1000,
                    }
                }}
                locale={{
                    last: "End tour"
                }}
            />
        </>
    );
};

export default Tour;