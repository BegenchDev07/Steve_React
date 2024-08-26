export default function keanuFetch() {
    function request(method) {
        return (url, body) => {
            let user = localStorage.getItem("user");
            let token = user ? JSON.parse(user).loginToken : "";
            const requestOptions = {
                method,
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };

            return fetch(url, requestOptions).then(data => {
                return handleResponse(data);
            }).catch(error => {
                return Promise.reject(error);
            });
        };
    }

    async function handleResponse(response) {
        const isJson = response.headers
            .get("content-type")
            ?.includes("application/json");
        const data = isJson ? await response.json() : null;

        if (data && data.error && data.error.name === "JsonWebTokenError") {
            localStorage.removeItem("user");
            return Promise.reject(data.error);
        }

        if (!response.ok) {
            if ([401, 403].includes(response.status)) {
                localStorage.removeItem('user');
                window.location.href = "/login";
            }
            const err = (data && data.message) || response.statusText;
            return Promise.reject(
                err + " resource request at: " + response.url// + ", login and try again"
            );
        }
        return Promise.resolve(data);
    }

    return {
        get: request("GET"),
        post: request("POST"),
        put: request("PUT"),
        delete: request("DELETE"),
    };
}
