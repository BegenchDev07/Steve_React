import React from "react";
import {createRoot} from 'react-dom/client';
import {Provider} from "react-redux";
import "/src/assets/css/index.css";
import App from "./App";
import store from "./redux/store";

// Updates to Client Rendering APIs: https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);
