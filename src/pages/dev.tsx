import IconButton from 'components/common/Button/IconButton'
import Flex from 'components/common/Flex'
import { IconType } from 'components/common/Icon'
import Text from 'components/common/Text'
import useIsDarkMode from 'hooks/useIsDarkMode'

export default function TestPageHelper(): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useIsDarkMode()

  return (
    <>
      <Text variant="title">Components</Text>
      <Flex mx={6} my={2} alignItems="center">
        <Text>Dark Mode</Text>
        <IconButton
          ml={2}
          icon={isDarkMode ? IconType.ToggleLeft : IconType.ToggleRight}
          onClick={() => setIsDarkMode(!isDarkMode)}
        />
      </Flex>

      {/* <Text variant="title" mx={6}>
        Buttons
      </Text>
      <ButtonDemoCard my={4} />
      <Text variant="title" mx={6}>
        Inputs
      </Text>
      <InputDemoCard my={4} />
      <Text variant="title" mx={6}>
        Alerts
      </Text>
      <AlertDemoCard my={4} />
      <Text variant="title" mx={6}>
        Modals
      </Text>
      <ModalDemoCard my={4} />
      <Text variant="title" mx={6}>
        Lists
      </Text>
      <ListDemoCard my={4} />
      <Text variant="title" mx={6}>
        Tables
      </Text>
      <TableDemoCard my={4} />
      <Text variant="title" mx={6}>
        Charts
      </Text>
      <ChartDemoCard my={4} />
      <Text variant="title" mx={6}>
        Text
      </Text>
      <TextDemoCard my={4} />
      <Text variant="title" mx={6}>
        Loading
      </Text>
      <LoadingDemoCard my={4} /> */}
    </>
  )
}
