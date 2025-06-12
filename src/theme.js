import {createSystem, defaultConfig, defineConfig, mergeConfigs} from "@chakra-ui/react"

const theme = defineConfig({
  theme: {
    tokens: {
      colors: {
        blue: {
          600: "#020873",
        },
        cyan: {
          600: "#0433BF",
        }
      },
    },
  },
})

const config = mergeConfigs(defaultConfig, theme);
export const system = createSystem(config);