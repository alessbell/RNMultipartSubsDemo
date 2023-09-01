import React from "react";
import { polyfill as polyfillEncoding } from "react-native-polyfill-globals/src/encoding";
import { polyfill as polyfillReadableStream } from "react-native-polyfill-globals/src/readable-stream";
import { polyfill as polyfillFetch } from "react-native-polyfill-globals/src/fetch";

import { Networking } from "react-native";
import AndroidNetworking from "react-native/Libraries/Network/RCTNetworking.android.js";
import IOSNetworking from "react-native/Libraries/Network/RCTNetworking.ios.js";

// IOSNetworking is defined (module with e.g. sendRequest method and others),
// Networking / AndroidNetworking is an empty object
console.log({ Networking, AndroidNetworking, IOSNetworking });

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
import { StyleSheet, Text, View, Button } from "react-native";

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

const QUERY = gql`
  query AllProductions {
    allProducts {
      id
      ... @defer {
        sku
      }
    }
  }
`;

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
  // const [showSubscription, setShowSubscription] = React.useState(true);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button
        title="Toggle subscription"
        onPress={() => {
          setShowSubscription(!showSubscription);
        }}
      />
      {/* {showSubscription ? <SubscriptionComponent /> : ""} */}
    </View>
  );
}

// function SubscriptionComponent() {
//   const { loading, error, data } = useSubscription(MULTIPART_SUBSCRIPTION);
//   console.log({ loading, error, data: JSON.stringify(data, null, 2) });

//   return (
//     <>
//       {loading ? <Text>Loading...</Text> : ""}
//       {error ? <Text>Error</Text> : ""}
//       {data ? <Text>{data.aNewDieWasCreated.die.sides}</Text> : ""}
//     </>
//   );
// }

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
