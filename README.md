## Reproduction Steps

1. Clone repository, `npm i`.
2. Run Android emulator and `npm run android`.
3. Observe `App.js` imports and logs. When doing `import { Networking } from "react-native";` and logging `Networking` it's an empty object; I'd expect it to have the same interface as the `IOSNetworking` import.