import { Button, IconButton, Menu, Portal } from "@chakra-ui/react";
import { BiChevronDown, BiDotsVertical } from "react-icons/bi";
import MeProgressCircle from "./MeProgressCircle";
import { Md10K } from "react-icons/md";

/**
 * 
 * @param {Object} props - The properties for the MeDropdownButton component.
 * @param {Array.<{label: string, loading?: boolean, conditional?: boolean, icon?: function, onClick: function}>} props.items - An array of objects where each object contains a label and an onClick function for the menu items
 * @param {Object?} props.button - The button properties including variant and text.
 * @param {string} props.button.variant - The variant of the button (e.g., "outline").
 * @param {string?} props.button.text - The text to be displayed on the button. 
 * @returns 
 */
const MeDropdownButton = ({ items, button }) => {
  /**
   * 
   * @param {{label: string, loading?: boolean, icon?: function, onClick: function}} item 
   */
  const onClick = (item) => {
    if (!item.onClick || item.loading) {
      return;
    }

    item.onClick();
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        {
          button?.text ? (
            <Button variant={button?.variant ? button.variant : "outline"}>
              {button.text}
              <BiChevronDown />
            </Button>
          ) : (
            <IconButton variant={button?.variant ? button.variant : "outline"} aria-label="Opções">
              <BiDotsVertical />
            </IconButton>
          )
        }
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {items.filter(item => item?.conditional !== false).map((item, index) => (
              <Menu.Item key={index} onClick={() => onClick(item)}>
                {(item.icon && item.loading) ? <MeProgressCircle size="xs" circleCss={{ "--thickness": "2px" }} /> : <item.icon size="24px" />}
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default MeDropdownButton;