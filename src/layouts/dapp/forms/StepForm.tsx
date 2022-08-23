// import { Box, Divider, Grid, Step, StepLabel, Stepper } from "@mui/material";
import { Button, Flex, Spacer } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import React, { useCallback } from "react";
// import { Button } from "./Button";

interface StepFormProps {
  steps: { label: string; element: React.ReactNode }[];
  children: (e: React.ReactNode) => React.ReactNode;
}

export default function StepForm(props: StepFormProps) {
  const { nextStep, prevStep, setStep, activeStep } = useSteps({
    initialStep: 0,
  });

  const Contents = useCallback(
    (props: any) => <>{props.children(props.element)}</>,
    []
  );

  return (
    <>
      <Steps
        orientation="vertical"
        activeStep={activeStep}
        onClickStep={(step) => setStep(step)}
      >
        {props.steps.map(({ label, element }) => (
          <Step width="100%" label={label} key={label}>
            <Contents children={props.children} element={element} />
          </Step>
        ))}
      </Steps>

      <Flex width="100%" justify="flex-center">
        <Button
          isDisabled={activeStep === 0}
          mr={4}
          size="sm"
          onClick={prevStep}
        >
          Prev
        </Button>
        <Spacer />
        <Button
          size="sm"
          onClick={nextStep}
          isDisabled={activeStep === props.steps.length - 1}
        >
          Next
        </Button>
      </Flex>
    </>
  );
}
