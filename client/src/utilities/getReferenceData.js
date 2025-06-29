export const getReferenceData = async (pWebPage) => {
    console.log("getReferenceData v2", pWebPage);

    try {
        let wReply = [];
        let wURL = "";
        if (pWebPage) {
            wURL = `${
                import.meta.env.VITE_BACKEND_URL
            }/reference/webPage/${pWebPage}`;
        } else {
            wURL = `${import.meta.env.VITE_BACKEND_URL}/reference/`;
        }
        const res = await fetch(
            // @ts-ignore
            wURL,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: null,
            }
        );
        const data = await res.json();
        if (res.ok) {
            if (pWebPage) {
                for (let wItem of data) {
                    let wValue = wItem.value;
                    wReply.push(wValue);
                }
                return wReply;
            } else {
                return data;
            }
        } else {
            console.log("getReferencedData fail", res);
            return [];
        }
    } catch (err) {
        throw new Error(`getReferenceData try-catch fail ${err}`);
    }
};
