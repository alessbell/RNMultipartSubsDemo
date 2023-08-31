import { polyfill as polyfillEncoding } from "react-native-polyfill-globals/src/encoding";
import { polyfill as polyfillReadableStream } from "react-native-polyfill-globals/src/readable-stream";
import { polyfill as polyfillFetch } from "react-native-polyfill-globals/src/fetch";

import {
  gql,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useQuery,
} from "@apollo/client";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

polyfillReadableStream();
polyfillEncoding();
polyfillFetch();

const MULTIPART_SUBSCRIPTION = gql`
  subscription MySubscription {
    aNewDieWasCreated {
      die {
        id
        roll
        sides
        color
      }
    }
  }
`;

// const QUERY = gql`
//   query AllProductions {
//     allProducts {
//       id
//       ... @defer {
//         sku
//       }
//     }
//   }
// `;

const link = new HttpLink({
  uri: "http://localhost:4040/",
  fetchOptions: {
    reactNative: { textStreaming: true },
  },
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

function App() {
  const { loading, error, data } = useSubscription(MULTIPART_SUBSCRIPTION);
  // const { loading, error, data } = useQuery(QUERY);
  console.log({ loading, error, data: JSON.stringify(data, null, 2) });

  return (
    <View style={styles.container}>
      {loading ? <Text>Loading...</Text> : ""}
      {error ? <Text>Error</Text> : ""}
      {data ? <Text>{data.aNewDieWasCreated.die.sides}</Text> : ""}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
